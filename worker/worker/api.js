var exports = module.exports = {
	sprint: require('./sprint'),
	github: require('./github'),
	jenkins: require('./jenkins')
};

function merge_pr(pull_request, branches)
{
	for (var i = 0; i < pull_request.length; i++)
		for (var j = 0; j < branches.length; j++)
			if (branches[j].name === pull_request[i].head)
				pull_request[i].build = branches[j];
	return pull_request;
}

function merge_data(github, jenkins)
{
	var data = [];

	for (var i = 0; i < github.length; i++) {
		for (var j = 0; j < jenkins.length; j++) {
			if (jenkins[j].name === github[i].name) {
				var merge = {
					name: github[i].name,
					tag: github[i].tag,
					jenkins_url: jenkins[j].url,
					github_url: github[i].url,
					issues: github[i].issues,
					pull_request: merge_pr(github[i].pull_request, jenkins[j].branches)
				};

				data.push(merge);
			}
		}
		break;
	}
	// delete data[0].issues;
	// delete data[0].branches;
	console.log(data[0].pull_request);
}

(async function()
{
	var data = {};

	await Promise.all([
		exports.github(),
		exports.jenkins(),
		// exports.sprint()
	]).then(res => {
		data.github = res[0];
		data.jenkins = res[1];
//		data.sprint = res[2];
	});
	// console.log(data);
	merge_data(data.github, data.jenkins);
})();

module.exports = async () => {
	const github = await require('./github')();
	const jenkins = await require('./jenkins')();
	const jira = await require('./jira')();

	return {
		github: merge_data(github, jenkins),
		jenkins: jenkins,
		jira: jira,
	};
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
	for (var i = 0; i < github.length; i++)
		for (var j = 0; j < jenkins.length; j++)
			if (jenkins[j].name === github[i].name)
				github[i].pull_request = merge_pr(github[i].pull_request, jenkins[j].branches)
	return github;
}

/*
(async function()
{
	var data = {};

	await Promise.all([
		require('./github')(),
		require('./jenkins')(),
		require('./jira')()
	]).then(res => {
		data.github = res[0];
		data.jenkins = res[1];
		data.sprint = res[0];
	});
	// merge_data(data.github, data.jenkins);
	console.log(data);
})();
*/
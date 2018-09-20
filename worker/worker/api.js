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
	var tab = [
		// { name: 'github', func: require('./github')() },
		{ name: 'jenkins', func: require('./jenkins')() },
		// { name: 'jira', func: require('./jira')() }
	]

	await Promise.all(tab.map(x => x.func))
		.then(res => {
			for (var i = 0; i < res.length; i++)
				data[tab[i].name] = res[i];
		});
	// merge_data(data.github, data.jenkins);
	console.log(data.jenkins[0].branches[12].flow[4]);
})();
*/
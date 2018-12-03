module.exports.get_api_data = get_api_data;

async function get_api_data()
{
	var data = {};
	const config = require('../application.json').project;
	const tab = [
		{ name: 'github', func: require('./github')() },
		{ name: 'jenkins', func: require('./jenkins')() },
		{ name: 'jira', func: require('./jira')() },
	];

	await Promise.all(tab.map(x => x.func))
		.then(res => {
			for (var i = 0; i < res.length; i++)
				data[tab[i].name] = res[i];
		})
	data.github = merge_data(data.github, data.jenkins);
	return filter_by_project(data, config);
};

// (async () => {
// 	const data = await get_api_data();

// 	console.log(data);
// })();

function filter_by_project(data, config)
{
	var tmp;
	var project = [];

	if (!config)
		return null;
	for (var i = 0; i < config.length; i++) {
		tmp = {};
		tmp.name = config[i].name;
		tmp.tools = {};
		for (var key in config[i].tools)
			if (data[key] && data[key].length && config[i].tools[key] && config[i].tools[key].length)
				tmp.tools[key] = data[key].find(x => x.name === config[i].tools[key]); // x.name => name is the common key between all api
		project.push(tmp);
	}
	return project;
}

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
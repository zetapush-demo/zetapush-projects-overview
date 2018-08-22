const axios = require('axios');
const utils = require('../utils');

const api = 'https://zetapush.atlassian.net/rest/api/2';

async function get_project_key_list(project_list, config)
{
	var keys = [];
	var res = await axios.get(`${api}/project/`, config).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log('Bad credentials => .zetarc =>');
			console.log('jira: {\n\t email || password => .zetarc');
			process.exit(1);
		};
	});

	for (var i = 0; i < project_list.length; i++)
		for (var j = 0; j < res.data.length; j++)
			if (res.data[j].name === project_list[i])
				keys.push(res.data[j].key);
	return keys;
}

async function get_issues_list(project_key, config)
{
	var issues = [];
	var res = await axios.get(`${api}/search?jql=project=${project_key}&maxResults=1`, config).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log('The authenticated account is not allowed to see that.');
			process.exit(1);
		}
	});
	var max = res.data.total;

	for (var i = 0; i < max; i += 100) {
		res = await axios.get(`${api}/search?jql=project=${project_key}&startAt=${i}&maxResults=100`, config);
		res.data.issues = res.data.issues.filter(issue => issue.fields.status.name != 'Delivered');
		issues = issues.concat(utils.filter_data(res.data.issues));
	}
	return issues;
}

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jira');
	const keys = await get_project_key_list(config.issues.project_list, config.http);

	console.log(keys);
	for (var i = 0; i < keys.length; i++) {
		var issues = await get_issues_list(keys[i], config.http);

		data.push({
			project: config.issues.project_list[i],
			key: keys[i],
			issues: issues
		});
	}
	return data[0].issues;
}
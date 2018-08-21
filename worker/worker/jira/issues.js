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

	for (var j = 0; j < project_list.length; j++)
		for (var i = 0; i < res.data.length; i++)
			if (res.data[i].name === project_list[j])
				keys.push(res.data[i].key);
	return keys;
}

function filter_data(issues)
{
	for (var i = 0; i < issues.length; i++) {
		issues[i] = {
			priority:	utils.extract_data(issues[i].fields.priority, ['id', 'iconUrl']),
			issuetype:	utils.extract_data(issues[i].fields.issuetype, ['name', 'iconUrl']),
			status:		utils.extract_data(issues[i].fields.status, ['name', 'id']),
			summary:	issues[i].fields.summary,
			created:	utils.parse_time(issues[i].fields.created),
			description:	issues[i].fields.description,
			reporter:	issues[i].fields.reporter && utils.extract_data(issues[i].fields.reporter, ['displayName', 'emailAddress', 'avatarUrls[48x48]']),
			assignee:	issues[i].fields.assignee && utils.extract_data(issues[i].fields.assignee, ['displayName', 'emailAddress', 'avatarUrls[48x48]'])
		};
		for (var tmp in issues[i])
			if (!issues[i][`${tmp}`])
				delete issues[i][`${tmp}`];
	}
	return issues;
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
		issues = issues.concat(filter_data(res.data.issues));
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
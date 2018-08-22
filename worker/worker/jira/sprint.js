const axios = require('axios');
const utils = require('../utils');

const api = 'https://zetapush.atlassian.net/rest/agile/1.0';

async function get_board_list(project_list, config)
{
	var list = [];
	var res = await axios.get(`${api}/board/`, config).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log('Bad credentials => .zetarc =>');
			console.log('jira: {\n\t email || password => .zetarc');
			process.exit(1);
		};
	});

	res = res.data.values;
	for (var i = 0; i < project_list.length; i++)
		for (var j = 0; j < res.length; j++)
			if (res[j].location.name === `${project_list[i].name} (${project_list[i].key})`)
				list.push(res[j].id);
	return list;
}

async function get_issues_list(project_config, config)
{
	const api_url = `https://zetapush.atlassian.net/rest/api/2/search?jql=project=${project_config.key}`;
	var issues = [];
	var res = await axios.get(`${api_url}&maxResults=1`, config).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log(`The authenticated account is not allowed to see\n\t => ${project_config.name}`);
			process.exit(1);
		}
	});
	var max = res.data.total;

	for (var i = 0; i < max; i += 100) {
		res = await axios.get(`${api_url}&startAt=${i}&maxResults=100`, config);
		res.data.issues = res.data.issues.filter(issue => issue.fields.status.name !== project_config.close_state);
		issues = issues.concat(utils.filter_data(res.data.issues));
	}
	return issues;
}

async function get_current_sprint(project_config, board_id, config)
{
	var sprint = {};
	var res = await axios.get(`${api}/board/${board_id}/sprint?state=active`, config)

	res = res.data.values[0];
	sprint = {
		id: res.id,
		name: res.name,
		start: utils.parse_time(res.startDate).slice(0, -9),
		end: utils.parse_time(res.endDate).slice(0, -9),
		issues: await get_issues_list(project_config, config)
	};
	return sprint;
}

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jira');
	const projects_config = config.sprint.project_list;
	const boards_id = await get_board_list(projects_config, config.http);

	if (boards_id.length == 0) {
		console.log('No valid projects were found =>');
		console.log('jira: {\n\tproject_list: {name || key}\n} => .zetarc');
		process.exit(1);
	}
	for (var i = 0; i < boards_id.length; i++) {
		var sprint = await get_current_sprint(projects_config[i], boards_id[i], config.http)

		data.push({
			project: projects_config[i].name,
			id: boards_id[i],
			sprint: sprint
		});
	}
	return data[0].sprint.issues;
}
const axios = require('axios');
const utils = require('../utils');

const api = 'https://zetapush.atlassian.net/rest/agile/1.0';

async function get_board_list(project_list, config)
{
	var boards_id = [];
	var res = await axios.get(`${api}/board/`, config).catch((err) => {
		if (err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error('Bad credentials => .zetarc =>');
			console.error('jira: {\n\t email || password => .zetarc');
			process.exit(1);
		}
	});

	res = res.data.values;
	for (var i = 0; i < project_list.length; i++)
		for (var j = 0; j < res.length; j++) {
			if (res[j].location.name === `${project_list[i].name} (${project_list[i].key})`) {
				boards_id.push(res[j].id);
				break;
			}
			if (j === res.length - 1) {
				console.error('Something bad in .zetarc =>\njira: { \n\t sprint: {');
				console.error(`\t\t project_list: [{\n\t\t\t name: "${project_list[i].name}"`);
				console.error(`\t\t\t key: "${project_list[i].key}"`);
				console.error(`\t\t\t close_state: "${project_list[i].close_state}"`);
				console.error(`\t\t}]\n\t}\n}`);
				process.exit(1);
			}
		}
	return boards_id;
}

async function put_sub_issues(issues, project_config, config)
{
	var res;
	var subtasks = [];

	for (var i = 0; i < issues.length; i++) {
		for (var j = 0; j < issues[i].subtasks.length; j++) {
			res = await axios.get(issues[i].subtasks[j], config).catch(err => console.log(err));
			if (res.data.fields.status.name !== project_config.close_state)
				subtasks.push(res.data);
		}
		issues[i].subtasks = utils.filter_data(subtasks);
		subtasks = [];
	}
}

async function get_current_sprint(project_config, board_id, config)
{
	var res = await axios.get(`${api}/board/${board_id}/sprint?state=active`, config)
	const sprint_id = res.data.values[0].id;
	const api_url = `${api}/sprint/${sprint_id}/issue?jql`;

	res = res.data.values[0];
	var sprint = {
		project: project_config.name,
		sprint: res.name,
		start: utils.parse_time(res.startDate).slice(0, -9),
		end: utils.parse_time(res.endDate).slice(0, -9),
		issues: await utils.get_issues_list(api_url, project_config, config)
	};
	sprint.issues = sprint.issues.filter(issue => issue.subtasks);
	await put_sub_issues(sprint.issues, project_config, config);
	return sprint;
}

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jira');
	const project_list = config.sprint.project_list;
	const boards_id = await get_board_list(project_list, config.http);

	console.assert(boards_id.length === project_list.length);
	if (boards_id.length == 0) {
		console.error('No valid projects were found =>');
		console.error('jira: {\n\tproject_list: {name || key}\n} => .zetarc');
		process.exit(1);
	}
	for (var i = 0; i < boards_id.length; i++) {
		const sprint = await get_current_sprint(project_list[i], boards_id[i], config.http);

		data.push(sprint);
	}
	return data;
}
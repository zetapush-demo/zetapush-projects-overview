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

async function get_current_sprint(project_config, board_id, config)
{
	var res = await axios.get(`${api}/board/${board_id}/sprint?state=active`, config)

	res = res.data.values[0];
	var sprint = {
		id: res.id,
		name: res.name,
		start: utils.parse_time(res.startDate).slice(0, -9),
		end: utils.parse_time(res.endDate).slice(0, -9),
		issues: await utils.get_issues_list(project_config, config)
	};
	sprint.issues = sprint.issues.filter(issue => issue.subtasks);
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
	return data;
}
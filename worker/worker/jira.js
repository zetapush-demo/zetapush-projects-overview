const axios = require('axios');
const { parse_time, get_config, get_issues_list } = require('./utils');

const api = 'https://zetapush.atlassian.net/rest/agile/1.0';

async function get_board_list(project_list, config)
{
	var boards_id = [];
	var res = await axios.get(`${api}/board/`, config).catch(err => {
		if (err && err.response && err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error('Bad credentials => .zetarc =>');
			console.error('jira: {\n\t email || password => .zetarc');
		} else
			console.log(err.errno, require('path').basename(__filename));
		process.exit(1);
	});

	res = res.data.values;
	for (var i = 0; i < project_list.length; i++)
		for (var j = 0; j < res.length; j++) {
			if (res[j].location.name === `${project_list[i].name} (${project_list[i].key})`) {
				boards_id.push(res[j].id);
				break;
			}
			if (j === res.length - 1) {
				console.error(`Something bad in .zetarc, or this project can't have sprint =>\njira: { \n\t sprint: {`);
				console.error(`\t\t project_list: [{\n\t\t\t name: "${project_list[i].name}"`);
				console.error(`\t\t\t key: "${project_list[i].key}"`);
				console.error(`\t\t\t close_state: "${project_list[i].close_state}"`);
				console.error(`\t\t}]\n\t}\n}`);
				process.exit(1);
			}
		}
	return boards_id;
}

function push_orphan_issues(sprint, subtasks_list)
{
	const orphan_issues = subtasks_list.filter(issue => !issue.subtasks && !issue.parent);

	if (orphan_issues.length) {
		sprint.issues.push({
			summary: 'Other issues',
			subtasks: orphan_issues
		});
	}
}

function put_sub_issues(sprint)
{
	const subtasks_list = sprint.issues.filter(issue => !issue.subtasks);

	sprint.issues = sprint.issues.filter(issue => issue.subtasks);
	for (var i = 0; i < sprint.issues.length; i++) {
		const subtasks = subtasks_list.filter(issue => issue.parent === sprint.issues[i].key);

		sprint.issues[i].subtasks = subtasks;
	}
	push_orphan_issues(sprint, subtasks_list);
	sprint.issues.forEach(issue => issue.subtasks && issue.subtasks.forEach(x => delete x.parent));
}

function compute_sprint_timetracking(issues, end, project_config)
{
	var sprint_time = {
		estimate: 0,
		remaining: (new Date(end).valueOf() - Date.now()) / 1000,
		spent: 0
	};

	for (var i = 0; i < issues.length; i++) {
		if (!issues[i].subtasks)
			continue;
		for (var j = 0; j < issues[i].subtasks.length; j++) {
			if (!issues[i].subtasks[j].timetracking)
				continue;
			if (issues[i].subtasks[j].status !== project_config.close_state)
				sprint_time.estimate += issues[i].subtasks[j].timetracking.originalEstimateSeconds || 0;
			sprint_time.spent += issues[i].subtasks[j].timetracking.timeSpentSeconds || 0;
		}
	}
	for (var key in sprint_time)
		sprint_time[key] = Math.round(sprint_time[key] / 3600);
	return sprint_time;
}

async function get_current_sprint(project_config, board_id, config)
{
	var res = await axios.get(`${api}/board/${board_id}/sprint?state=active`, config);
	var api_url;
	var data = [];

	if (!res.data.values.length)
		return [];
	res = res.data.values;
	for (var i = 0; i < res.length; i++) {
		api_url = `${api}/sprint/${res[i].id}/issue?jql`;
		var sprint = {
			sprint: res[i].name,
			start: res[i].startDate,
			end: res[i].endDate,
			issues: await get_issues_list(api_url, board_id, project_config, config)
		};
		put_sub_issues(sprint);
		sprint.time = compute_sprint_timetracking(sprint.issues, sprint.end, project_config);
		sprint.issues = sprint.issues.filter(issue => {
			if (issue.subtasks)
				issue.subtasks = issue.subtasks.filter(sub => sub.status !== project_config.close_state);
			if (issue.status !== project_config.close_state)
				return issue;
		});
		sprint.start = parse_time(sprint.start).slice(0, -9);
		sprint.end = parse_time(sprint.end).slice(0, -9);
		data.push(sprint);
	}
	return data;
}

module.exports = async function()
{
	var data = [];
	const config = get_config('jira');
	const boards_id = await get_board_list(config.sprint, config.http);

	console.assert(boards_id.length === config.sprint.length);
	if (boards_id.length === 0) {
		console.error('No valid projects were found =>');
		console.error('jira: {\n\tconfig.sprint: {name || key}\n} => .zetarc');
		process.exit(1);
	}
	for (var i = 0; i < boards_id.length; i++) {
		const sprint = {
			project: config.sprint[i].name,
			url: `https://zetapush.atlassian.net/secure/RapidBoard.jspa?rapidView=${boards_id[i]}`,
			sprint: await get_current_sprint(config.sprint[i], boards_id[i], config.http)
		}

		data.push(sprint);
	}
	return data;
}
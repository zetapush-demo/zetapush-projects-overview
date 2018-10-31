const axios = require('axios');
const { parse_time, get_config, get_issues_list } = require('./utils');

const api = 'https://zetapush.atlassian.net/rest/agile/1.0';

function http_error_handler(err)
{
	console.error('=>\t', err.config.method.toUpperCase(), '\t', err.config.url);
	if (err && err.response && err.response.status != 200) {
		console.error(err.response.status, err.response.statusText);
		console.error('Maybe bad credentials => application.json =>');
		console.error('jira: {\n\t email || password\n}');
	} else
		console.error(err.errno, require('path').basename(__filename), 'Maybe check your internet connexion.');
}

function config_error(project, field) {
	console.error(`Something bad in application.json, or this project can't have ${field} =>`);
	console.error(`jira: { \n\t project: {`);
	console.error(`\t\t ${field}: [{\n\t\t\t name: "${project.name}"`);
	console.error(`\t\t\t key: "${project.key}"`);
	console.error(`\t\t\t close_state: "${project.close_state}"`);
	console.error(`\t\t}]\n\t}\n}`);
}

function filter_badly_config_project(project)
{
	const valid_keys = ['name', 'key', 'close_state'];

	function arraysEqual(arr1, arr2) {
		if (arr1.length !== arr2.length)
			return false;
		for (var i = arr1.length; i--; )
			if (arr1[i] !== arr2[i])
				return false;
		return true;
	}

	if (!project)
		return project;
	project.forEach(x => {
		for (var key in x) {
			if (!x[key] || !Object.keys(x[key]).length)
				continue;
			if (!arraysEqual(valid_keys, Object.keys(x[key]))) {
				config_error(x[key], key);
				delete x[key];
			} else
				for (var subkey in x[key]) {
					if (typeof x[key][subkey] !== 'string' || !x[key][subkey].length) {
						config_error(x[key], key);
						delete x[key];
						break;
					}
				}
		}
	});
	return project;
}

async function fill_sprint_board(project, http)
{
	var res = await axios.get(`${api}/board/`, http).catch(http_error_handler);

	if (!res || !res.data || !res.data.values.length)
		return;
	res = res.data.values;
	for (var i = 0; i < project.length; i++) {
		if (!project[i].sprint || !Object.keys(project[i].sprint).length)
			continue;
		for (var j = 0; j < res.length; j++) {
			if (res[j].location.name === `${project[i].sprint.name} (${project[i].sprint.key})`) {
				project[i].sprint.id = res[j].id;
				break;
			}
			if (j === res.length - 1)
				config_error(project[i].sprint);
		}
	}
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
	const displayName = issues.map(x => x.subtasks.map(y => y.reporter.displayName)).join().split(',').filter((a, b, c) => c.indexOf(a) === b);
	var details = [];
	var sprint_time = {
		estimate: 0,
		remaining: (new Date(end).valueOf() - Date.now()) / 1000,
		spent: 0,
	};

	for (var i = 0; i < displayName.length; i++)
		details.push({
			name: displayName[i],
			spent: 0,
			estimate: 0
		});
	for (var i = 0; i < issues.length; i++) {
		if (!issues[i].subtasks)
			continue;
		for (var j = 0; j < issues[i].subtasks.length; j++) {
			if (!issues[i].subtasks[j].timetracking)
				continue;
			const tmp = details.find(x => x.name === issues[i].subtasks[j].reporter.displayName);

			if (issues[i].subtasks[j].status !== project_config.close_state) {
				tmp.estimate += issues[i].subtasks[j].timetracking.originalEstimateSeconds || 0;
				sprint_time.estimate += issues[i].subtasks[j].timetracking.originalEstimateSeconds || 0;
			}
			sprint_time.spent += issues[i].subtasks[j].timetracking.timeSpentSeconds || 0;
			tmp.spent += issues[i].subtasks[j].timetracking.timeSpentSeconds || 0;
		}
	}
	details.forEach(x => {
		x.spent = Math.round(x.spent / 3600);
		x.estimate = Math.round(x.estimate / 3600);
	});
	for (var key in sprint_time)
		sprint_time[key] = Math.round(sprint_time[key] / 3600);
	sprint_time.details = details;
	return sprint_time;
}

async function get_current_sprint(project_config, board_id, http)
{
	var res = await axios.get(`${api}/board/${board_id}/sprint?state=active`, http).catch(http_error_handler);
	var api_url;
	var data = [];

	if (!res || !res.data || !res.data.values.length)
		return [];
	res = res.data.values;
	for (var i = 0; i < res.length; i++) {
		api_url = `${api}/sprint/${res[i].id}/issue?jql`;
		var sprint = {
			sprint: res[i].name,
			start: res[i].startDate,
			end: res[i].endDate,
			issues: await get_issues_list(api_url, board_id, project_config, http)
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

async function get_tracker(project_config, http)
{
	const api_url = `https://zetapush.atlassian.net/rest/api/2/search?jql=project=${project_config.key}`;
	const issues = await get_issues_list(api_url, null, project_config, http);

	return issues.filter(issue => issue.status !== project_config.close_state);
}

module.exports = async function()
{
	var data = [];
	var { project, http } = get_config('jira');

	project = filter_badly_config_project(project);
	await fill_sprint_board(project, http);
	for (var i = 0; i < project.length; i++) {
		var tmp = {};

		if (project[i].sprint && Object.keys(project[i].sprint).length && project[i].sprint.id) {
			tmp.sprint = {
				name: project[i].sprint.name,
				url: `https://zetapush.atlassian.net/secure/RapidBoard.jspa?rapidView=${project[i].sprint.id}`,
				sprint: await get_current_sprint(project[i].sprint, project[i].sprint.id, http)
			};
		}
		if (project[i].tracker && Object.keys(project[i].tracker).length) {
			tmp.tracker = {
				name: project[i].tracker.name,
				url: `https://zetapush.atlassian.net/projects/${project[i].tracker.key}/issues`,
				tracker: await get_tracker(project[i].tracker, http)
			};
		}

		/*
		 * If we are choice, we choose classic project name instead of tracker project name :
		 * 'Leocare' instead of 'Leocare Tracker'
		 */

		if (tmp.sprint && tmp.sprint.name)
			tmp.name = tmp.sprint && tmp.sprint.name;
		else if (tmp.tracker && tmp.tracker.name)
			tmp.name = tmp.tracker && tmp.tracker.name;
		if (tmp && Object.keys(tmp).length)
			data.push(tmp);
	}
	return data;
}
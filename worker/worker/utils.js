const axios = require('axios');

var exports = module.exports = {};

function check_bracket(str)
{
	const tmp1 = str.indexOf('[');
	const tmp2 = str.indexOf(']');

	return tmp1 !== -1 && tmp2 !== -1 && tmp1 < tmp2;
}

function filter_data(issues, board_id)
{
	for (var i = 0; i < issues.length; i++) {
		issues[i] = {
			key:		issues[i].key,
			url:		board_id ? `https://zetapush.atlassian.net/secure/RapidBoard.jspa?rapidView=${board_id}&modal=detail&selectedIssue=${issues[i].key}` : `https://zetapush.atlassian.net/projects/${issues[i].key.split('-')[0]}/issues/${issues[i].key}`,
			parent:		issues[i].fields.parent && issues[i].fields.parent.key,
			priority:	exports.extract_data(issues[i].fields.priority, ['id', 'iconUrl']),
			issuetype:	exports.extract_data(issues[i].fields.issuetype, ['name', 'iconUrl']),
			status:		issues[i].fields.status.name,
			summary:	issues[i].fields.summary,
			created:	exports.parse_time(issues[i].fields.created),
			description:	issues[i].fields.description,
			reporter:	exports.extract_data(issues[i].fields.reporter, ['displayName', 'avatarUrls[48x48]']),
			assignee:	exports.extract_data(issues[i].fields.assignee, ['displayName', 'avatarUrls[48x48]']),
			subtasks:	issues[i].fields.subtasks,
			timetracking:	exports.extract_data(issues[i].fields.timetracking, ['originalEstimateSeconds', 'remainingEstimateSeconds', 'timeSpentSeconds'])
		};
		for (var tmp in issues[i])
			if (!issues[i][tmp] || issues[i][tmp].length === 0 || (Object.keys(issues[i][tmp]).length === 0 && issues[i][tmp].constructor === Object))
				delete issues[i][tmp];
	}
	return issues;
}

exports.extract_data = function extract_data(src, keys)
{
	var dest = {};

	if (!src || !keys)
		return null;
	for (var i = 0; i < keys.length; i++) {
		if (keys[i] && check_bracket(keys[i])) {
			const obj = keys[i].substring(0, keys[i].indexOf('['));
			const key = keys[i].split(/[\[\]]/)[1];

			dest[obj] = extract_data(src[obj], [key])[key];
		} else if (!src[keys[i]])
			continue;
		else
			dest[keys[i]] = src[keys[i]];
	}
	return dest;
}

exports.get_issues_list = async function get_issues_list(api_url, board_id, project_config, config)
{
	const http_error_handler = (err) => {
		console.error('=>\t', err.config.method.toUpperCase(), '\t', err.config.url);
		if (err && err.response && err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error(`Maybe the authenticated account is not allowed to see\n\t => ${project_config.name}`);
			console.error('Maybe bad credentials => application.json =>');
			console.error('jira: {\n\t email || password\n}');
		} else
			console.error(err.errno, require('path').basename(__filename), 'Maybe check your internet connexion.');
	};
	var res = await axios.get(`${api_url}&maxResults=1`, config).catch(http_error_handler);
	var max = 0;
	var issues = [];

	if (res && res.data)
		max = res.data.total;
	for (var i = 0; i < max; i += 100) {
		res = await axios.get(`${api_url}&startAt=${i}&maxResults=100`, config).catch(http_error_handler);
		issues = issues.concat(filter_data(res.data.issues, board_id));
	}
	return issues;
}

exports.obj_tab_filter = function obj_tab_filter(obj, accept)
{
	if (!obj || !accept || accept.every(x => !x.length))
		return null;
	return obj.map(x => {
		var tmp = {};

		accept.forEach(key => tmp[key] = x[key]);
		return tmp;
	});
}

exports.parse_time = function parse_time(time)
{
	const tmp = new Date(time);
	var d = tmp.getDate();
	var m = tmp.getMonth() + 1; // January is 0!
	const y = tmp.getFullYear();
	const hours_minutes = tmp.toString().split(' ')[4];

	if (d < 10)
		d = '0' + d;
	if (m < 10)
		m = '0' + m;
	return `${d}-${m}-${y} ${hours_minutes}`;
}

exports.get_good_color = function get_good_color(objtab)
{
	for (var i = 0; i < objtab.length; i++)
		objtab[i].color = "#" + objtab[i].color;
	return objtab;
}

exports.get_config = function get_config(data_field)
{
	const config_file = '../application.json';
	const data = require(config_file);

	if (!data[data_field]) {
		console.error(`'${data_field}' doesn't exist in ${config_file}...`);
		process.exit(1);
	}
	return data[data_field];
}
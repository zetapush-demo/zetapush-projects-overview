const axios = require('axios');
const fs = require('fs');

var exports = module.exports = {};

function get_substring(str, regex)
{
	var tmp = str.split(regex);

	tmp.splice(-1, 1);
	return tmp.splice(-1, 1).join();
}

function check_bracket(str)
{
	var tmp1 = str.indexOf('[');
	var tmp2 = str.indexOf(']');

	return tmp1 != -1 && tmp2 != -1 && tmp1 < tmp2;
}

function filter_data(issues)
{
	for (var i = 0; i < issues.length; i++) {
		issues[i] = {
			key:		issues[i].key,
			parent:		issues[i].fields.parent && issues[i].fields.parent.key,
			priority:	extract_data(issues[i].fields.priority, ['id', 'iconUrl']),
			issuetype:	extract_data(issues[i].fields.issuetype, ['name', 'iconUrl']),
			status:		issues[i].fields.status.name,
			summary:	issues[i].fields.summary,
			created:	exports.parse_time(issues[i].fields.created),
			description:	issues[i].fields.description,
			reporter:	extract_data(issues[i].fields.reporter, ['displayName', 'avatarUrls[48x48]']),
			assignee:	extract_data(issues[i].fields.assignee, ['displayName', 'avatarUrls[48x48]']),
			subtasks:	issues[i].fields.subtasks,
			timetracking:	extract_data(issues[i].fields.timetracking, ['originalEstimateSeconds', 'remainingEstimateSeconds', 'timeSpentSeconds'])
		};
		for (var tmp in issues[i])
			if (!issues[i][tmp] || issues[i][tmp].length === 0 || (Object.keys(issues[i][tmp]).length === 0 && issues[i][tmp].constructor === Object))
				delete issues[i][tmp];
	}
	return issues;
}

function extract_data(src, keys)
{
	var dest = {};

	if (!src || !keys)
		return null;
	for (var i = 0; i < keys.length; i++) {
		if (check_bracket(keys[i])) {
			const obj = keys[i].substring(0, keys[i].indexOf('['));
			const key = get_substring(keys[i], /[\[\]]/);

			dest[obj] = extract_data(src[obj], [key])[key];
		} else if (!src[keys[i]])
			continue;
		else
			dest[keys[i]] = src[keys[i]];
	}
	return dest;
}

exports.get_issues_list = async function get_issues_list(api_url, project_config, config)
{
	var res = await axios.get(`${api_url}&maxResults=1`, config).catch(err => {
		if (err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error(`The authenticated account is not allowed to see\n\t => ${project_config.name}`);
			process.exit(1);
		}
	});
	const max = res.data.total;
	var issues = [];

	for (var i = 0; i < max; i += 100) {
		res = await axios.get(`${api_url}&startAt=${i}&maxResults=100`, config);
		res.data.issues = res.data.issues.filter(issue => issue.fields.status.name !== project_config.close_state);
		issues = issues.concat(filter_data(res.data.issues));
	}
	return issues;
}

exports.obj_tab_filter = function obj_tab_filter(obj, accept)
{
	return obj.map(x => {
		var tmp = {};

		accept.forEach(key => tmp[key] = x[key]);
		return tmp;
	});
}

exports.parse_time = function parse_time(time)
{
	var tmp = new Date(time);
	var d = tmp.getDate();
	var m = tmp.getMonth() + 1; // January is 0!
	var y = tmp.getFullYear();
	var time = tmp.toString().split(' ')[4];

	if (d < 10)
		d = '0' + d;
	if (m < 10)
		m = '0' + m;
	return `${d}-${m}-${y} ${time}`;
}

exports.get_good_color = function get_good_color(objtab)
{
	for (var i = 0; i < objtab.length; i++)
		objtab[i].color = "#" + objtab[i].color;
	return (objtab);
}

exports.get_config = function get_config(data_field)
{
        var data = JSON.parse(fs.readFileSync('./.zetarc'));

	if (!data[data_field]) {
		console.error(`'${data_field}' doesn't exist in '.zetarc'...`);
		process.exit(1);
	}
	return data[data_field];
}
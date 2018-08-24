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

exports.filter_data = function filter_data(issues)
{
	for (var i = 0; i < issues.length; i++) {
		issues[i] = {
			priority:	exports.extract_data(issues[i].fields.priority, ['id', 'iconUrl']),
			issuetype:	exports.extract_data(issues[i].fields.issuetype, ['name', 'iconUrl']),
			status:		exports.extract_data(issues[i].fields.status, ['name', 'id']),
			summary:	issues[i].fields.summary,
			created:	exports.parse_time(issues[i].fields.created),
			description:	issues[i].fields.description,
			reporter:	issues[i].fields.reporter && exports.extract_data(issues[i].fields.reporter, ['displayName', 'emailAddress', 'avatarUrls[48x48]']),
			assignee:	issues[i].fields.assignee && exports.extract_data(issues[i].fields.assignee, ['displayName', 'emailAddress', 'avatarUrls[48x48]']),
			subtasks:	issues[i].fields.subtasks.map(task => task.self)
		};
		for (var tmp in issues[i])
			if (!issues[i][tmp] || issues[i][tmp].length === 0)
				delete issues[i][tmp];
	}
	return issues;
}

exports.extract_data = function extract_data(src, keys)
{
	var dest = {};

	if (typeof keys === 'undefined')
		return null;
	for (var i = 0; i < keys.length; i++) {
		if (check_bracket(keys[i])) {
			var obj = keys[i].substring(0, keys[i].indexOf('['));
			var key = get_substring(keys[i], /[\[\]]/);

			dest[obj] = extract_data(src[obj], [key])[key];
		} else
			dest[keys[i]] = src[keys[i]];
	}
	return dest;
}

exports.get_issues_list = async function get_issues_list(api_url, project_config, config)
{
	var res = await axios.get(`${api_url}&maxResults=1`, config).catch((err) => {
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
		issues = issues.concat(exports.filter_data(res.data.issues));
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

	return (tmp.toString().split(' ').slice(0, -2).join(' '));
}

exports.get_good_color = function get_good_color(objtab)
{
	for (var i = 0; i < objtab.length; i++)
		objtab[i].color = "#" + objtab[i].color;
	return (objtab);
}

exports.get_config = function get_config(data_field)
{
        var data = fs.readFileSync('../.zetarc');

	data = JSON.parse(data);
	return data[data_field] || `'${data_field}' doesn't exist in '.zetarc'...`;
}
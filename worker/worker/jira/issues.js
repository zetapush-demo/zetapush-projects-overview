var axios = require('axios');
var utils = require('../utils');

var config = {
	auth: {
		username: 'damien@zetapush.com',
		password: 'j6KsTYttwnwiuYbQoCDWA55F'
	},
};

var project = ['BiOSENCY Tracker'];
var api = 'https://zetapush.atlassian.net/rest/api/2';

async function get_project_key_list()
{
	var keys = [];
	var res = await axios.get(`${api}/project/`, config);

	for (var j = 0; j < project.length; j++)
		for (var i = 0; i < res.data.length; i++)
			if (res.data[i].name === project[j])
				keys.push(res.data[i].key);
	return keys;
}

function filter_data(issues) {
	issues.forEach((elem) => {
		elem.priority = {
			id: elem.fields.priority.id,
			icon: elem.fields.priority.iconUrl,
		};
		elem.issuetype = {
			name: elem.fields.issuetype.name,
			icon: elem.fields.issuetype.iconUrl
		};
		elem.status = {
			name: elem.fields.status.name,
			id: elem.fields.status.id
		};
		elem.summary = elem.fields.summary;
		elem.created = utils.parse_time(elem.fields.created);
		elem.description = elem.fields.description;
		if (elem.fields.reporter != null)
			elem.reporter = {
				name: elem.fields.reporter.displayName,
				email: elem.fields.reporter.emailAddress, // maybe useless
				avatar: elem.fields.reporter.avatarUrls['48x48']
			}
		if (elem.fields.assignee != null)
			elem.assignee = {
				name: elem.fields.assignee.displayName,
				email: elem.fields.assignee.emailAddress, // maybe useless
				avatar: elem.fields.assignee.avatarUrls['48x48']
			}
		delete elem.self;
		delete elem.expand;
		delete elem.id;
		delete elem.fields;
	});
	return issues;
}

async function get_issues_list(project_key)
{
	var issues = [];
	var res = await axios.get(`${api}/search?jql=project=${project_key}&maxResults=1`, config);
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
	var keys = await get_project_key_list();

	console.log(keys);
	for (var i = 0; i < keys.length; i++) {
		var issues = await get_issues_list(keys[i]);

		data.push({
			project: project[i],
			key: keys[i],
			issues: issues
		});
	}
	return data[0].issues;
}


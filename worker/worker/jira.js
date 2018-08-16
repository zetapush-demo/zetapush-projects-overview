var axios = require('axios');

var config = {
	auth: {
		username: 'damien@zetapush.com',
		password: 'j6KsTYttwnwiuYbQoCDWA55F'
	},
};

var project = ['BiOSENCY Tracker', 'BiOSENCY'];
var api = 'https://zetapush.atlassian.net/rest/api/2';

async function get_project_key_list()
{
	var key = [];
	var res = await axios.get(`${api}/project/`, config);

	for (var i = 0; i < res.data.length; i++) {
		project.find((name) => {
			if (name == res.data[i].name)
				key.push(res.data[i].key);
		});
	}
	return key;
}

function filter_data(res) {
	res.data.issues.forEach((elem) => {
		for (var key in elem.fields)
			if (key.match(/customfield_/))
				delete elem.fields[key];
	});
}

async function get_issues_list(project_key)
{
	var issues = [];
	var res = await axios.get(`${api}/search?jql=project=${project_key}&maxResults=1`, config);
	var max = res.data.total;

	filter_data(res);
	issues.push(res.data.issues[0]);
	for (var i = 0; i < max; i += 100) {
		res = await axios.get(`${api}/search?jql=project=${project_key}&startAt=${i + 1}&maxResults=100`, config);
		filter_data(res);
		issues = issues.concat(res.data.issues);
	}
	return issues.filter((issue) => issue.fields.status.name != 'Delivered');
}

module.exports = async function()
{
	var data = [];
	var keys = await get_project_key_list();

	for (var i = 0; i < keys.length; i++) {
		var issues = await get_issues_list(keys[i]);

		data.push({
			project: project[i],
			key: keys[i],
			issues: issues
		});
	}
	return data[0];
}


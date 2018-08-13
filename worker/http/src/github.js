var axios = require('axios');
var utils = require('./utils');

var config = {
	headers: {
		'User-Agent': "zetapush-demo",
		'Authorization': 'token 5f5473e7ef0c724ae14ab7d162820b8921f57c6e'
	},
};

async function get_repo_list()
{
	var res = await axios.get('https://api.github.com/orgs/zetapush/repos', config);
	var data = res.data;
	var list = [];

	for (var i = 0; i < data.length; i++)
		if (data[i].open_issues && data[i].name == 'zetapush')
			list.push(data[i].name);
	return list;
}

async function get_tag(repo_name)
{
	var res = await axios.get(`https://api.github.com/repos/zetapush/${repo_name}/tags`, config);

	return res.data[0].name;
}

async function get_issues(repo_name)
{
	var res = await axios.get(`https://api.github.com/repos/zetapush/${repo_name}/issues`, config);
	var data = res.data;
	var issues = [];

	for (var i = 0; i < data.length; i++) {
		if (data[i].pull_request)
			continue;
		data[i] = {
			name: data[i].title,
			id: data[i].number,
			url: data[i].html_url,
			user: {
				name: data[i].user.login,
				avatar: data[i].user.avatar_url,
				url: data[i].user.html_url
			},
			created: utils.parse_time(data[i].created_at),
			labels: utils.get_good_color(utils.obj_tab_filter(data[i].labels, ["name", "color"])),
			body: data[i].body,
			assignees: utils.obj_tab_filter(data[i].assignees, ["login", "avatar_url"])
		};
		issues.push(data[i]);
	}
	return issues;
}

async function get_pull_request(repo_name)
{
	var res = await axios.get(`https://api.github.com/repos/zetapush/${repo_name}/pulls`, config);
	var data = res.data;
	var pull_request = [];

	for (var i = 0; i < data.length; i++) {
		data[i] = {
			name: data[i].title,
			id: data[i].number,
			url: data[i].html_url,
			user: {
				name: data[i].user.login,
				avatar: data[i].user.avatar_url,
				url: data[i].user.html_url
			},
			created: utils.parse_time(data[i].created_at),
			labels: utils.get_good_color(utils.obj_tab_filter(data[i].labels, ["name", "color"])),
			body: data[i].body,
			requested_reviewers: utils.obj_tab_filter(data[i].requested_reviewers, ["login", "avatar_url"]),
			commit: data[i].commits,
			head: data[i].head.ref,
			base: data[i].base.ref
		};
		pull_request.push(data[i]);
	}
	return pull_request;
}

module.exports = async function()
{
	var data = {};

	data.repo = await get_repo_list();
	data.tag = await get_tag(data.repo);
	data.issues = await get_issues(data.repo);
	data.pull_request = await get_pull_request(data.repo);
	return data;
}
var axios = require('axios');
var utils = require('./utils');

const api_url = 'https://api.github.com/repos/zetapush';

async function get_repo_list(config)
{
	const res = await axios.get('https://api.github.com/orgs/zetapush/repos', config.http).catch((err) => {
		if (err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error('Bad credentials => .zetarc =>');
			console.error('github: {\n\t User-Agent || Authorisation\n}');
			process.exit(1);
		};
	});

	for (var i = 0; i < res.data.length; i++)
		if (res.data[i].open_issues && res.data[i].name === config.repo)
			return res.data[i].name;
	return null;
}

async function get_tag(config, repo_name)
{
	const res = await axios.get(`${api_url}/${repo_name}/tags`, config.http);

	return res.data[0].name || '';
}

async function get_issues(config, repo_name)
{
	const res = await axios.get(`${api_url}/${repo_name}/issues`, config.http);
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

async function get_pull_request(config, repo_name)
{
	const res = await axios.get(`${api_url}/${repo_name}/pulls`, config.http);
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
			head: data[i].head.ref,
			base: data[i].base.ref
		};
		pull_request.push(data[i]);
	}
	return pull_request;
}

module.exports = async function()
{
	const config = utils.get_config('github');
	var data = {};

	data.repo = await get_repo_list(config);
	if (!data.repo) {
		console.error(`Repository "${config.repo}" not found.`);
		process.exit(1);
	}
	await Promise.all([
		get_tag(config, data.repo),
		get_issues(config, data.repo),
		get_pull_request(config, data.repo)
	]).then((res) => {
		data.tag = res[0];
		data.issues = res[1];
		data.pull_request = res[2];
	});
	return data;
}
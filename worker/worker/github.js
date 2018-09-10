const axios = require('axios');
const { get_config, parse_time, obj_tab_filter, get_good_color } = require('./utils');

const api_url = 'https://api.github.com/repos/zetapush';

async function get_repo_list(repos, config)
{
	var repo_list = [];
	const res = await axios.get('https://api.github.com/orgs/zetapush/repos', config).catch(err => {
		if (err.response.status != 200) {
			console.error(err.response.status, err.response.statusText);
			console.error('Bad credentials => .zetarc =>');
			console.error('github: {\n\t User-Agent || Authorisation\n}');
			process.exit(1);
		}
	});

	for (var i = 0; i < repos.length; i++)
		for (var j = 0; j < res.data.length; j++) {
			if (res.data[j].name === repos[i] && res.data[j].open_issues) {
				repo_list.push({
					name: res.data[j].name,
					issues_nb: res.data[j].open_issues
				});
				break;
			}
			if (j === res.data.length - 1) {
				console.error(`Something bad in .zetarc, or this github repository doesn't exist =>\n\tgithub:`);
				console.error(`\t\trepos: [{\n\t\t\tname: "${JSON.stringify(repos[i])}"`);
				console.error(`\t\t}]\n\t}\n}`);
				process.exit(1);
			}
		}
	return repo_list;
}

async function get_tag(config, repo_name)
{
	const res = await axios.get(`${api_url}/${repo_name}/tags`, config.http);

	if (!res.data.length)
		return '';
	return res.data[0].name;
}

function filter_data(issue)
{
	issue = {
		name: issue.title,
		id: issue.number,
		url: issue.html_url,
		user: {
			name: issue.user.login,
			avatar: issue.user.avatar_url,
			url: issue.user.html_url
		},
		created: parse_time(issue.created_at),
		labels: get_good_color(obj_tab_filter(issue.labels, ['name', 'color'])),
		body: issue.body,
		assignees: obj_tab_filter(issue.requested_reviewers || issue.assignees, ['login', 'avatar_url']),
		head: issue.head && issue.head.ref,
		base: issue.base && issue.base.ref
	};
	for (var tmp in issue)
		if (!issue[tmp])
			delete issue[tmp];
	return issue;
}

async function get_data(config, api_search_field, repo_name, issues_nb)
{
	var res;
	var issues = [];

	for (var i = 0; i < issues_nb; i += 30) {
		res = await axios.get(`${api_url}/${repo_name}/${api_search_field}?page=${i / 30 + 1}`, config.http);
		if (!res.data.length)
			break;
		for (var j = 0; j < res.data.length; j++) {
			if (res.data[j].pull_request)
				continue;
			issues.push(filter_data(res.data[j]));
		}
	}
	return issues;
}

module.exports = async function()
{
	const config = get_config('github');
	const repo_list = await get_repo_list(config.repos, config.http);
	var data = [];

	for (var i = 0; i < repo_list.length; i++) {
		await Promise.all([
			get_tag(config, repo_list[i].name, repo_list[i].issues_nb),
			get_data(config, 'issues', repo_list[i].name, repo_list[i].issues_nb),
			get_data(config, 'pulls', repo_list[i].name, repo_list[i].issues_nb)
		]).then(res => {
			data.push({
				repo: repo_list[i].name,
				tag: res[0],
				issues: res[1],
				pull_request: res[2]
			});
		});
	}
	return data;
}
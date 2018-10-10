const axios = require('axios');
const { get_config, parse_time, obj_tab_filter, get_good_color } = require('./utils');

const api_url = 'https://api.github.com/repos';

function http_error_handler(err)
{
	console.log('=>\t', err.config.method.toUpperCase(), '\t', err.config.url);
	if (err && err.response && err.response.status != 200) {
		console.error(err.response.status, err.response.statusText);
		console.error(`Something bad in application.json, or bad github credentials`);
	} else
		console.log(err.errno, require('path').basename(__filename), 'Maybe check your internet connexion.');
	process.exit(1);
}

async function get_valid_repo_list(repos, config)
{
	var repo_list = [];

	for (var i = 0; i < repos.length; i++) {
		for (var j = 0; j < repos[i].repos.length; j++) {
			const tmp = await axios.get(`${api_url}/${repos[i].owner}/${repos[i].repos[j]}`, config).catch(err => {
				console.log('=>\t', err.config.method.toUpperCase(), '\t', err.config.url);
				if (err && err.response && err.response.status != 200) {
					console.error(err.response.status, err.response.statusText);
					console.error(`Something bad in application.json, this github account/organization/repository doesn't exist, or bad credentials =>`);
					console.error(`github: {\n\trepos: {`)
					console.error(`\t\towner: ${JSON.stringify(repos[i].owner)},`);
					console.error(`\t\trepos: ${JSON.stringify(repos[i].repos)}`);
					console.error(`\t}\n}`);
				} else
					console.log(err.errno, require('path').basename(__filename));
				process.exit(1);
			});

			repo_list.push({
				owner: repos[i].owner,
				name: repos[i].repos[j],
				issues_nb: tmp.data && tmp.data.open_issues
			});
		}
	}
	return repo_list;
}

async function get_tag(config, repo)
{
	const res = await axios.get(`${api_url}/${repo.owner}/${repo.name}/tags`, config.http).catch(http_error_handler);

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
		timestamp: new Date(issue.created_at).valueOf(),
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

async function get_data(config, api_search_field, repos, issues_nb)
{
	var res;
	var issues = [];

	for (var i = 0; i < issues_nb; i += 30) {
		res = await axios.get(`${api_url}/${repos.owner}/${repos.name}/${api_search_field}?page=${i / 30 + 1}`, config.http).catch(http_error_handler);
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
	const repo_list = await get_valid_repo_list(config.repos, config.http);
	var data = [];

	for (var i = 0; i < repo_list.length; i++) {
		await Promise.all([
			get_tag(config, repo_list[i]),
			get_data(config, 'issues', repo_list[i], repo_list[i].issues_nb),
			get_data(config, 'pulls', repo_list[i], repo_list[i].issues_nb)
		]).then(res => {
			data.push({
				name: repo_list[i].name,
				url: `https://github.com/${repo_list[i].owner}/${repo_list[i].name}`,
				tag: res[0],
				issues: res[1],
				pull_request: res[2]
			});
		});
	}
	return data;
}
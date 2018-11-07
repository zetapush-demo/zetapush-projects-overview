const axios = require('axios');
const { parse_time, get_config } = require('./utils');
const { send_message_user } = require('./bitrix');

const jenkins_assets = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/';

const blue_url = 'blue/organizations/jenkins/';
const api_url = 'blue/rest/organizations/jenkins/pipelines';

function http_error_handler(err)
{
	console.error('=>\t', err.config.method.toUpperCase(), '\t', err.config.url);
	if (err && err.response && err.response.status != 200)
		console.error(err.response.status, err.response.statusText);
	else
		console.error(err.errno, require('path').basename(__filename), 'Maybe check your internet connexion.');
}

async function get_child_project(jenkins_url, project)
{
	var res = await axios.get(`${jenkins_url}/${api_url}/${project.name}/pipelines`).catch(http_error_handler);

	if (!res || !res.data || !res.data.length)
		return [];
	res = res.data.filter(x => {
		for (var i = 0; i < project.child.length; i++)
			if (project.child[i] === x.name)
				return x;
	});
	return res.map(x => `${jenkins_url}${x._links.self.href}`);
}

async function get_repo_urls(jenkins_url, project)
{
	const res = await axios.get(`${jenkins_url}/${api_url}`).catch(http_error_handler);
	var urls = [];

	if (!res || !res.data || !res.data.length)
		return [];
	for (var i = 0; i < project.length; i++) {
		for (var j = 0; j < res.data.length; j++) {
			if (res.data[j].name === project[i].name) {
				if (project[i].child && project[i].child.length)
					urls = urls.concat(await get_child_project(jenkins_url, project[i]));
				else
					urls.push(`${jenkins_url}${res.data[j]._links.self.href}`);
				break;
			}
			if (j === res.data.length - 1)
				console.error(`Project ${project[i].name} not found.`);
		}
	}
	return urls;
}

function tree_flatter(tree)
{
	for (var i = 0; i < tree.length; i++) {
		if (tree[i].child.length === 1) {
			tree_flatter(tree[i].child[0]);
			tree.push(tree[i].child[0]);
			delete tree[i].child;
		} else if (tree[i].child.length > 1)
			for (var j = 0; j < tree[i].child.length; j++)
				tree_flatter(tree[i].child[j].child);
	}
}

function tree_cleaner(tree)
{
	for (var i = 0; i < tree.length; i++) {
		if (tree[i].state === 'SKIPPED' || (tree[i].type === 'PARALLEL' && tree[i].parent === null)) {
			tree.splice(i, 1);
			tree_cleaner(tree);
		}
		if (tree[i] && tree[i].child && tree[i].child.length !== 0)
			tree_cleaner(tree[i].child);
	}
}

function build_flow_tree(arr)
{
	var tree = [];
	var mappedArr = {};

	for (var i = 0; i < arr.length; i++) {
		mappedArr[arr[i].id] = arr[i];
		mappedArr[arr[i].id].child = [];
	}
	for (var id in mappedArr)
		if (mappedArr[id].parent)
			mappedArr[mappedArr[id].parent].child.push(mappedArr[id]);
		else
			tree.push(mappedArr[id]);
	tree_cleaner(tree);
	tree_flatter(tree);
	return tree.sort((elem1, elem2) => elem1.id - elem2.id);
}

async function get_branch_flow(url)
{
	var res = await axios.get(url).catch(http_error_handler);

	if (!res || !res.data || !res.data.length)
		return [];
	res = res.data.map(x => {
		return {
			name: x.displayName,
			result: x.result,
			state: x.state,
			duration: x.durationInMillis,
			type: x.type,
			id: x.id,
			parent: x.firstParent
		}
	});
	return build_flow_tree(res);
}

function get_tree_lenght(tree)
{
	var depth = 0;

	for (var i = 0; i < tree.length; i++)
		if (tree[i].child)
			for (var j = 0; j < tree[i].child.length; j++)
				depth += get_tree_lenght(tree[i].child[j]);
		else
			depth++;
	return depth + 1;
}

function get_tree_max_lenght_until(tree, field, value)
{
	var depth = 0;

	for (var i = 0; i < tree.length; i++) {
		if ((!tree[i].child || tree[i].child.length === 0) && tree[i][field] !== value)
			return depth;
		if (tree[i].child)
			depth += get_tree_max_lenght_until(tree[i].child, field, value) - 1;
		else
			depth++;
	}
	return depth + 1;
}

function get_icon_by_flow(flow)
{
	const last = get_tree_max_lenght_until(flow, 'result', 'SUCCESS');
	const length = get_tree_lenght(flow);
	const score = (last / length) * 100;

	for (var i = 0; i < 80; i += 20)
		if (score >= i && score < i + 20)
			return `${jenkins_assets}health-${i || '00'}to${i + 19}.png`;
	return `${jenkins_assets}health-80plus.png`;
}

async function get_branch_array(project_url, branch_url)
{
	var branches = [];
	var res = await axios.get(branch_url).catch(http_error_handler);

	if (!res || !res.data || !res.data.length)
		return [];
	res = res.data.filter(x => !x.pullRequest);
	for (var i = 0; i < res.length; i++) {
		if (!res[i].latestRun)
			continue;
		const name = res[i].name;
		const id = res[i].latestRun.id;
		const flow = await get_branch_flow(`${branch_url}/${name}/runs/${id}/nodes`);

		var branch = {
			name: res[i].displayName,
			time: {
				start: parse_time(res[i].latestRun.startTime),
				end: parse_time(res[i].latestRun.endTime),
				duration: new Date(res[i].latestRun.durationInMillis).toISOString().substr(11, 8),
			},
			url: `${project_url}/detail/${name}/${id}`,
			icon: flow && get_icon_by_flow(flow),
			result: res[i].latestRun.result,
			state: res[i].latestRun.state,
			github_url: res[i].branch.url,
			pull_request: res[i].pullRequest,
			flow: flow
		};
		if (branch.state === 'RUNNING') {
			branch.result = 'RUNNING';
			branch.icon = `${jenkins_assets}nobuilt_anime.gif`;
			branch.in_progress = true;
		}
		for (var tmp in branch)
			if (!branch[tmp])
				delete branch[tmp];
		branches.push(branch);
	}
	return branches;
}

var ignore_list = [];

async function popup_on_new_build(branches, name)
{
	const in_progress_branch = branches.filter((x, y) => y < 1 || x.in_progress);
	const this_ignore = ignore_list.find(x => x.name === name);
	const filter_branch = in_progress_branch.filter(x => !this_ignore || !this_ignore.branch.includes(x.name));

	if (filter_branch && filter_branch.length) {
		for (var i = 0; i < filter_branch.length; i++)
			await send_message_user('pacome.francon@zetapush.com', `New build !!\n${name} - ${filter_branch[i].name}`);
		if (this_ignore && this_ignore.length)
			this_ignore.branch = this_ignore.branch.concat(filter_branch.map(x => x.name));
		else
			ignore_list.push({
				name: name,
				branch: [ ...filter_branch.map(x => x.name) ]
			});
	}
	if (!in_progress_branch || !in_progress_branch.length) {
		const tmp = ignore_list.indexOf(this_ignore);

		if (tmp !== -1)
			ignore_list.splice(tmp, 1);
	}
}

module.exports = async function()
{
	var data = [];
	const jenkins = get_config('jenkins');
	const repo_urls = await get_repo_urls(jenkins.url, jenkins.project);

	for (var i = 0; i < repo_urls.length; i++) {
		const res = await axios.get(repo_urls[i]).catch(http_error_handler);
		var project_url;

		if (!res || !res.data) {
			console.error(`Jenkins API return empty data on ${repo_urls[i]}...`);
			continue;
		}
		project_url = `${jenkins.url}/${blue_url}${res.data.fullName.replace(/\//, '%2F')}`;
		data.push({
			name: res.data.displayName,
			description: res.data.fullDisplayName,
			url: `${project_url}/activity`,
			branches: await get_branch_array(project_url, `${repo_urls[i]}branches`)
		});
		await popup_on_new_build(data[i].branches, res.data.displayName);
	}
	return data;
}

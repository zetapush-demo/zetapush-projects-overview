const axios = require('axios');
const { parse_time, get_config } = require('./utils');

const jenkins_assets = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/';

const blue_url = 'blue/organizations/jenkins/ZetaPush%20Github%2F';
const api_url = 'blue/rest/organizations/jenkins/pipelines/ZetaPush%20Github/pipelines/';

async function get_repo_urls(jenkins_url)
{
	const res = await axios.get(`${jenkins_url}/${api_url}`).catch(err => {
		if (err && err.response && err.response.status != 200)
			console.log(err.response.status, err.response.statusText);
		else
			console.log(err.errno, require('path').basename(__filename));
		process.exit(1);
	});

	return res.data.map(x => `${jenkins_url}${x._links.self.href}`);
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
	return tree//.sort((elem1, elem2) => elem1.id - elem2.id);
}

async function get_branch_flow(url, name, proj)
{
	var res = await axios.get(url);

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
	});//.filter(x => x.state !== 'SKIPPED' && x.type !== 'PARALLEL');

	// console.log();
	// console.log();
	// console.log(proj, name, res);
	// console.log();
	// console.log();

	return build_flow_tree(res);
}

function get_tree_lenght(obj)
{
	var depth = 0;

	if (obj.child)
		for (var i = 0; i < obj.child.length; i++) {
			const tmp = get_tree_lenght(obj.child[i]);

			if (tmp > depth)
				depth = tmp;
		}
	return depth + 1;
}

function get_tree_max_lenght_until(obj, field, pattern)
{
	var depth = 0;

	if (obj[field] !== pattern)
		return depth;
	if (obj.child)
		for (var i = 0; i < obj.child.length; i++) {
			const tmp = get_tree_max_lenght_until(obj.child[i], field, pattern);

			if (tmp > depth)
				depth = tmp;
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

async function get_branch_array(local_url, branch_url, project_name)
{
	var branches = [];
	const res = await axios.get(branch_url);

	for (var i = 0; i < res.data.length; i++) {
		const name = res.data[i].name;
		const id = res.data[i].latestRun.id;
		const flow = await get_branch_flow(`${branch_url}/${name}/runs/${id}/nodes`, name, project_name);

		var branch = {
			name: res.data[i].displayName,
			time: {
				start: parse_time(res.data[i].latestRun.startTime),
				end: parse_time(res.data[i].latestRun.endTime),
				duration: new Date(res.data[i].latestRun.durationInMillis).toISOString().substr(11, 8),
			},
			url: `${local_url}/${blue_url}${project_name}/detail/${name}/${id}`,
			icon: flow && get_icon_by_flow(flow),
			result: res.data[i].latestRun.result,
			state: res.data[i].latestRun.state,
			runSummary: res.data[i].latestRun.runSummary,
			github_url: res.data[i].branch.url,
			pull_request: res.data[i].pullRequest,
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

module.exports = async function()
{
	var data = [];
	const jenkins = get_config('jenkins');
	const repo_urls = await get_repo_urls(jenkins.url);

	for (var i = 0; i < repo_urls.length; i++) {
		const res = await axios.get(repo_urls[i]);
		const branches = await get_branch_array(jenkins.url, `${repo_urls[i]}branches`, res.data.name);

		data.push({
			name: res.data.displayName,
			description: res.data.fullDisplayName,
			url: `${jenkins.url}/${blue_url}${res.data.name}/activity`,
			branches: branches.filter(x => !x.pull_request),
			pull_request: branches.filter(x => x.pull_request)
		});
	}
	return data.reverse();
}
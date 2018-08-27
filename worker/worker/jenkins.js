const axios = require('axios');
const utils = require('./utils');

const jenkins_assets = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/';

async function get_repo_list(jenkins_url)
{
	var url = [];
	const res = await axios.get(jenkins_url).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log(`Url : ${jenkins_url}`);
			process.exit(1);
		}
	});

	for (var i = 0; i < res.data.jobs.length; i++)
		url.push(`${res.data.jobs[i].url}api/json`);
	return url;
}

async function get_timestamp_last_build(build_url)
{
	const res = await axios.get(`${build_url}api/json`);

	return utils.parse_time(res.data.timestamp);
}

async function get_branch_array(branch_url_array)
{
	var branchs = [];

	if (!branch_url_array)
		return '0 branch';
	for (var i = 0; i < branch_url_array.length; i++) {
		const res = await axios.get(`${branch_url_array[i].url}api/json`);
		var new_branch = {};

		new_branch.name = res.data.displayName;
		new_branch.time = await get_timestamp_last_build(res.data.lastBuild.url);
		new_branch.branch_url = res.data.url;
		if (!res.data.healthReport.length) {
			new_branch.last_build = {
				url: res.data.lastBuild.url,
				icon: `${jenkins_assets}nobuilt_anime.gif`,
				description: 'Build in progress',
				in_progress: true
			};
		} else {
			new_branch.last_build = {
				description: res.data.healthReport[0].description,
				url: res.data.lastBuild.url,
				icon: `${jenkins_assets}${res.data.healthReport[0].iconUrl}`,
				score: res.data.healthReport[0].score,
			};
		}
		branchs.push(new_branch);
	}
	return branchs;
}

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jenkins');
	const jenkins_url = `${config.url}api/json`;
	var repo_list = await get_repo_list(jenkins_url);

	for (var i = 0; i < repo_list.length; i++) {
		var res = await axios.get(repo_list[i]);

		data.push({
			name: res.data.name,
			description: res.data.description,
			url: res.data.url,
			branchs: await get_branch_array(res.data.jobs)
		});
	}
	return data;
}
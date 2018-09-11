const axios = require('axios');
const { parse_time, get_config } = require('./utils');

const jenkins_assets = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/';

const blue_url = 'http://ci.zpush.io:28702/blue/organizations/jenkins/ZetaPush%20Github%2F'

async function get_repo_urls(jenkins_url)
{
	var url = [];
	const res = await axios.get(jenkins_url).catch(err => {
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

	return parse_time(res.data.timestamp);
}

async function get_branch_array(branch_url_array, project_name)
{
	var branchs = [];

	if (!branch_url_array)
		return '0 branch';
	for (var i = 0; i < branch_url_array.length; i++) {
		const res = await axios.get(`${branch_url_array[i].url}api/json`);

		var new_branch = {
			name: res.data.displayName,
			time: await get_timestamp_last_build(res.data.lastBuild.url),
			url: `${blue_url}${project_name}/detail/${res.data.displayName}/${res.data.lastBuild.number}/pipeline`
		};
		if (!res.data.healthReport.length) {
			new_branch.icon = `${jenkins_assets}nobuilt_anime.gif`;
			new_branch.description = 'Build in progress !!';
			new_branch.in_progress = true;
		} else {
			new_branch.icon = `${jenkins_assets}${res.data.healthReport[0].iconUrl}`;
			new_branch.description = res.data.healthReport[0].description;
			new_branch.score = res.data.healthReport[0].score;
		}
		branchs.push(new_branch);
	}
	return branchs;
}

module.exports = async function()
{
	var data = [];
	const config = get_config('jenkins');
	const jenkins_url = `${config.url}api/json`;
	const repo_urls = await get_repo_urls(jenkins_url);

	for (var i = 0; i < repo_urls.length; i++) {
		var res = await axios.get(repo_urls[i]);

		data.push({
			name: res.data.name,
			description: res.data.description,
			url: `${blue_url}${res.data.name}/activity`,
			branchs: await get_branch_array(res.data.jobs.filter(branch => branch.color !== 'disabled'), res.data.name)
		});
	}
	return data;
}
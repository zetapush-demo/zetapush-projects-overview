var axios = require('axios');

async function get_repo_list()
{
	var url = [];
	var res = await axios.get('http://ci.zpush.io:28702/job/ZetaPush%20Github/api/json?pretty');

	for (var i = 0; i < res.data.jobs.length; i++)
		url.push(res.data.jobs[i].url + 'api/json?pretty');
	return url;
}

async function get_timestamp_last_build(build_url)
{
	var res = await axios.get(build_url + 'api/json?pretty');

	return res.data.timestamp;
}

async function get_branch_array(branch_url_array)
{
	var branchs = [];
	var res;

	for (var i = 0; i < branch_url_array.length; i++) {
		res = (await axios.get(branch_url_array[i] + 'api/json?pretty')).data;
		branchs.push({
			name: res.displayName,
			last_build: {
				description: res.healthReport[0],
				url: res.lastBuild.url,
				icon: 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/' + res.healthReport[0].iconUrl,
				score: res.healthReport[0].score,
				time: await get_timestamp_last_build(res.lastBuild.url)
			},
			branch_url: res.url
		});
	}
	return branchs;
}

module.exports = async function()
{
	var data = [];
	var repo_list = await get_repo_list();

	for (var i = 0; i < repo_list.length; i++) {
		var res = (await axios.get(repo_list[i])).data;

		data.push({
			name: res.name,
			description: res.description,
			url: res.url,
			branch: await get_branch_array(res.jobs)
		});
	}
	return data;
}
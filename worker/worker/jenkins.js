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
		res = await axios.get(branch_url_array[i].url + 'api/json?pretty');
		branchs.push({
			name: res.data.displayName,
			last_build: {
				description: res.data.healthReport[0].description,
				url: res.data.lastBuild.url,
				icon: 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/' + res.data.healthReport[0].iconUrl,
				score: res.data.healthReport[0].score,
			},
			time: await get_timestamp_last_build(res.data.lastBuild.url),
			branch_url: res.data.url
		});
	}
	return branchs;
}

module.exports = async function()
{
	var data = [];
	var repo_list = await get_repo_list();

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
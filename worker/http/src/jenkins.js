var axios = require('axios');

async function get_repo_list()
{
	var url = [];
	var res = await axios.get('http://ci.zpush.io:28702/job/ZetaPush%20Github/api/json?pretty');

	for (var i = 0; i < res.jobs.length; i++)
		url.push(res.jobs[i] + 'api/json?pretty');
	return url;
}

async function get_branch_info(repo_url)
{
	var res = await axios.get(repo_url);
	var branch = {
		name: res.displayName,
		last_build: {
			description: res.healthReport[0],
			url: res.lastBuild.url,
			icon: 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/48x48/' + res.healthReport[0].iconUrl,
			score: res.healthReport[0].score,
		},
		branch_url: res.url
	};
	return branch;
}

async function put_time_last_build(branchs, mdr)
{
	var res = await axios.get();

	branchs.find((branch) => {
		if (mdr.fullDisplayName.indexOf(branch.name) != -1)
			branch.time = mdr.timestamp;
	});
}

function get_branch_array(url_array)
{
	var branch_url;
	var res = await axios.get(url);

	for (var i = 0; i < res.jobs.length; i++)
		branch_url.push(res.jobs[i] + 'api/json?pretty');
	return branch_url;
}

module.exports = async function()
{
	var data = [];
	var repo_list = await get_repo_list();

	for (var i = 0; i < repo_list.length; i++) {
		var res = await axios.get(repo_list[i]);

		data.push({
			name: res.name,
			description: res.description,
			url: res.url,
			branch: await get_branch_array(res.jobs)
		});
	}
	return data;
}
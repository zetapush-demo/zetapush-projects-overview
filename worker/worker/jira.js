var axios = require('axios');

var config = {
	auth: {
		username: 'damien@zetapush.com',
		password: 'j6KsTYttwnwiuYbQoCDWA55F'
	},
};

var project = ['BiOSENCY Tracker'];

async function get_project_list()
{
	var url = [];
	var res = await axios.get('https://zetapush.atlassian.net/rest/api/2/project/', config);

	for (var i = 0; i < res.data.length; i++) {
		project.find((name) => {
			if (name == res.data[i].name)
				url.push(res.data[i].self);
		});
	}
	return url;
}

module.exports = async function()
{
	var data = [];
	var project_list = await get_project_list();

	console.log(project_list);
	for (var i = 0; i < project_list.length; i++) {
		var res = await axios.get(project_list[i], config);

		data.push(res.data);
	}

	return data;
}
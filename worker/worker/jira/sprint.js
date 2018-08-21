const axios = require('axios');
const utils = require('../utils');

const api = 'https://zetapush.atlassian.net/rest/agile/1.0';

async function get_board_list(project_list, config)
{
	var list = [];
	var res = await axios.get(`${api}/board/`, config).catch((err) => {
		if (err.response.status != 200) {
			console.log(err.response.status, err.response.statusText);
			console.log('Bad credentials => .zetarc =>');
			console.log('jira: {\n\t email || password => .zetarc');
			process.exit(1);
		};
	});

	res = res.data.values;
	for (var j = 0; j < project_list.length; j++)
		for (var i = 0; i < res.length; i++)
			if (res[i].location.name === project_list[j])
				list.push(res[i].id);
	return list;
}

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jira');
	const boards_id = await get_board_list(config.sprint.project_list, config.http);

	console.log(boards_id)
	// for (var i = 0; i < boards.length; i++)
	// 	var sprint
	return data;
}
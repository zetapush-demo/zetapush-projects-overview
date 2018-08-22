const utils = require('../utils');

module.exports = async function()
{
	var data = [];
	const config = utils.get_config('jira');
	const projects_config = config.issues.project_list;

	for (var i = 0; i < projects_config.length; i++) {
		var issues = await utils.get_issues_list(projects_config[i], config.http);

		data.push({
			project: projects_config[i].name,
			key: projects_config[i].key,
			issues: issues
		});
	}
	return data;
}
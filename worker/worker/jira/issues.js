const { get_issues_list, get_config } = require('../utils');

module.exports = async function()
{
	var data = [];
	const config = get_config('jira');
	const projects_config = config.issues.project_list;

	for (var i = 0; i < projects_config.length; i++) {
		const api_url = `https://zetapush.atlassian.net/rest/api/2/search?jql=project=${projects_config[i].key}`;
		const issues = await get_issues_list(api_url, projects_config[i], config.http);

		data.push({
			project: projects_config[i].name,
			key: projects_config[i].key,
			issues: issues
		});
	}
	return data;
}
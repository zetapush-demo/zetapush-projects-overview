const { get_issues_list, get_config } = require('../utils');

module.exports = async function()
{
	var data = [];
	const config = get_config('jira');

	for (var i = 0; i < config.tracker.length; i++) {
		const api_url = `https://zetapush.atlassian.net/rest/api/2/search?jql=project=${config.tracker[i].key}`;
		const issues = await get_issues_list(api_url, null, config.tracker[i], config.http);

		data.push({
			name: config.tracker[i].name,
			key: config.tracker[i].key,
			issues: issues.filter(issue => issue.status !== config.tracker[i].close_state)
		});
	}
	return data;
}
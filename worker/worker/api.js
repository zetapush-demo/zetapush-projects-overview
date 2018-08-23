var exports = module.exports = {
	jira: {
		issues: require('./jira/issues'),
		sprint: require('./jira/sprint')
	},
	github: require('./github'),
	jenkins: require('./jenkins')
};

(async function()
{
	var data = {
		jira: {}
	};
	await Promise.all([
		exports.github(),
		exports.jenkins(),
		exports.jira.issues(),
		exports.jira.sprint()
	]).then((res) => {
		data.github = res[0];
		data.jenkins = res[1];
		data.jira.issues = res[2];
		data.jira.sprint = res[3];
	});
	console.log(data);
})();
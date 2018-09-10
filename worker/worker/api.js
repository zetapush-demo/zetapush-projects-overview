var exports = module.exports = {
	sprint: require('./sprint'),
	github: require('./github'),
	jenkins: require('./jenkins')
};

/*
(async function()
{
	var data = {};

	await Promise.all([
		exports.github(),
		exports.jenkins(),
		exports.sprint()
	]).then(res => {
		data.github = res[0];
		data.jenkins = res[1];
		data.sprint = res[2];
	});
	console.log(data);
})();
*/
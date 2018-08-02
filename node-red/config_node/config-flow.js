async function weakly_connect(client, api, credentials) {
	await client.setCredentials(credentials);
	await client.connect();
	const groups  = await api.memberOf();
	if (groups && !groups.member)
		await api.addMeToConversation();
}

module.exports = function(RED) {
	function ConfigFlowNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		const {	SmartClient } = require('@zetapush/client');
		const transports = require('@zetapush/cometd/lib/node/Transports');

		// Create new ZetaPush Client
		var client = new SmartClient({
			transports,
			platformUrl: config.platformUrl,
			appName: config.appName,
		});

		const api = client.createProxyTaskService();

		var flowContext = node.context().flow;

		flowContext.set('api', api);
		flowContext.set('client', client);

		node.on('input', async function(msg) {
			await client.connect();
			if (!await client.isStronglyAuthenticated())
				await weakly_connect(client, api, {
					login: config.login,
					password: config.password
				});
			node.log('connected');
			await api.sendMessage({
				data: msg.payload
			});
			node.log('data: ' + msg.payload);
		});
	}
	RED.nodes.registerType('config-flow', ConfigFlowNode);
}
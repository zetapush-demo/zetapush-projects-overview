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

		flowContext.set("api", api);
		flowContext.set("client", client);

		node.on('input', function(msg) {
			client.connect().then(async () => {
				node.log('connected');
				if (await api.checkUser({ key: config.login }) == undefined) {
					await api.createUser({
						'email': config.email,
						'login': config.login,
						'password': config.password
					});
					await api.addMeToConversation();
				}
				await api.sendMessage({
					data: msg.payload
				});
			});
		});
	}
	RED.nodes.registerType("config-flow", ConfigFlowNode);
}
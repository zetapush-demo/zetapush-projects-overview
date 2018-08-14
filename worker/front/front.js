// Create new ZetaPush Client
var client = new ZetaPushClient.WeakClient({
	platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
	appName: 'YcBd4O_X',
});

const api = client.createProxyTaskService();

(async function sendMessage() {
	await client.connect();
	await api.sendMessage();
	setInterval( async () => {
		await api.sendMessage()
	}, 900000);
})();
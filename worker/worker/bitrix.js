const axios = require('axios');

var exports = module.exports = {};

async function get_user_id(config, email)
{
	const url = `${config.url}/${config.id}/${config.token}/user.get`;
	var res = await axios.get(url, config);

	if (res && res.result) {
		res = res.result.find(x => x.EMAIL === email);
		return res && res.ID;
	}
}

async function get_channel_id(config, channel)
{
	const url = `${config.url}/${config.id}/${config.token}/im.search.chat.list`
	const data = `FIND="${channel}"`;
	const res = await axios.post(url, data, config);

	if (res && res.result && res.result.length)
		return res.result[0].id;
}

exports.send_message_channel = async function send_message_channel(channel, message)
{
	const config = get_config('github').bitrix;
	const url = `${config.url}/${config.id}/${config.token}/im.message.add`;
	const channel_id = await get_channel_id(channel);

	if (channel_id)
		return await axios.post(url, `CHAT_ID=${channel_id}&MESSAGE=${message}`, config);
}

exports.send_message_user = async function send_message_user(email, message)
{
	const config = get_config('github').bitrix;
	const url = `${config.url}/${config.id}/${config.token}/im.message.add`;
	const channel_id = await get_user_id(email);

	if (channel_id)
		return await axios.post(url, `USER_ID=${channel_id}&MESSAGE=${message}`, config);
}
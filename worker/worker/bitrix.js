const axios = require('axios');
const { get_config } = require('./utils');

var exports = module.exports = {};

async function get_user_id(config, email)
{
	const url = `${config.url}/${config.id}/${config.token}/user.get`;
	var res = await axios.get(url).catch(err => console.error(err));

	if (res && res.data && res.data.result) {
		res = res.data.result.find(x => x.EMAIL === email);
		return res && res.ID;
	}
}

async function get_channel_id(config, channel)
{
	const url = `${config.url}/${config.id}/${config.token}/im.search.chat.list`
	const data = `FIND=${channel}`;
	const res = await axios.post(url, data).catch(err => console.error(err));

	if (res && res.data && res.data.result && res.data.result.length)
		return res.data.result[0].id;
}

exports.send_message_channel = async function send_message_channel(channel, message)
{
	const config = get_config('bitrix');
	const url = `${config.url}/${config.id}/${config.token}/im.message.add`;
	const channel_id = await get_channel_id(config, channel).catch(err => console.error(err));

	if (channel_id)
		return await axios.post(url, `CHAT_ID=${channel_id}&MESSAGE=${message}`).catch(err => console.error(err));
}

exports.send_message_user = async function send_message_user(email, message)
{
	const config = get_config('bitrix');
	const url = `${config.url}/${config.id}/${config.token}/im.message.add`;
	const user_id = await get_user_id(config, email);

	if (user_id)
		return await axios.post(url, `USER_ID=${user_id}&MESSAGE=${message}`).catch(err => console.error(err));
}
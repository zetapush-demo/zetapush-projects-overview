import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

interface BitrixConfig {
	token: string;
	id: number;
	channel: string;
}

@Injectable({
	providedIn: 'root'
})
export class BitrixService {

	config: BitrixConfig;
	api_url = 'https://zetapush.bitrix24.eu/rest';

	constructor(
		private http: HttpClient
	) {
		this.config = require('../../../../worker/application.json').bitrix;
	}

	get_user_id(email: string) {
		const url = `${this.api_url}/${this.config.id}/${this.config.token}/user.get`;

		return this.http.get(url).pipe((res: any) => {
			if (res && res.data && res.data.result) {
				res = res.data.result.find(x => x.EMAIL === email);
				return res && res.ID;
			}
		});
	}

	get_channel_id(channel: string) {
		const url = `${this.api_url}/${this.config.id}/${this.config.token}/im.search.chat.list`
		const data = `FIND="${channel}"`;

		return this.http.post(url, data).pipe((res: any) => {
			if (res && res.data && res.data.result && res.data.result.length)
				return res.data.result[0].id;
		});
	}

	send_message_channel(channel: string, message: string) {
		const url = `${this.api_url}/${this.config.id}/${this.config.token}/im.message.add`;
		const channel_id = this.get_channel_id(channel);

		if (!channel_id)
			return false;
		const data = `CHAT_ID=${channel_id}&MESSAGE=${message}`;

		return this.http.post(url, data).pipe((res: any) => {
			return res && res.data;
		});
	}

	send_message_user(email: string, message: string) {
		const url = `${this.api_url}/${this.config.id}/${this.config.token}/im.message.add`;
		const channel_id = this.get_user_id(email);

		if (!channel_id)
			return false;
		const data = `USER_ID=${channel_id}&MESSAGE=${message}`;

		return this.http.post(url, data).pipe((res: any) => {
			return res && res.data;
		});
	}
}
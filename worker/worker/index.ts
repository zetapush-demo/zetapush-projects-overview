import { Simple, Messaging, Groups, BasicAuthenticatedUser } from '@zetapush/platform-legacy';
import { Injectable, Context } from '@zetapush/core'
import { get_api_data } from './api';

const GROUP_ID = 'githubGroup';

@Injectable()
export default class Api {

	last_data: object;
	requestContext: Context;

	async onApplicationBootstrap() {
		const { exists } = await this.groups.exists({
			group: GROUP_ID
		});
		if (!exists)
			await this.groups.createGroup({
				group: GROUP_ID
			});
		await this.sendMessage();
		setInterval(async () => {
			await this.sendMessage();
		}, 1000 * 60 * 15); // 15 minutes
	}

	constructor(
		private messaging: Messaging,
		private groups: Groups,
		private simple: Simple
	) { }

	async addMeToConversation() {
		await this.groups.addUser({
			group: GROUP_ID,
			user: this.requestContext.owner
		});
	}

	async sendMessage() {
		const group = await this.groups.groupUsers({
			group: GROUP_ID
		});
		const users = group.users || [];

		console.log('Start sending: ', new Date().toLocaleString());

		const message = await get_api_data();

		this.messaging.send({
			target: users,
			data: message
		});
		console.log('Done: ', new Date().toLocaleString());
		console.log(message);
		this.last_data = message;
	}

	async createUser(user_info: BasicAuthenticatedUser) {
		try {
			await this.simple.createUser(user_info);
		}
		catch(err) {
			console.log('err: ', err);
		}
	}

	get_last_data() {
		return this.last_data;
	}
}
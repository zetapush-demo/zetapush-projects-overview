import { Simple, Messaging, Groups, Injectable, BasicAuthenticatedUser } from '@zetapush/platform';
import * as Github from './github';
import * as Jenkins from './jenkins';

const GROUP_ID = 'githubGroup';

@Injectable()
export default class Api {

	last_data: object;

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
		}, 900000);
	}

	constructor(
		private messaging: Messaging,
		private groups: Groups,
		private simple: Simple
	) { }

	async addMeToConversation(parameters: any, context: any) {
		await this.groups.addUser({
			group: GROUP_ID,
			user: context.owner
		});
	}

	async sendMessage() {
		const group = await this.groups.groupUsers({
			group: GROUP_ID
		});
		const users = group.users || [];

		console.log('Start sending: ', new Date().toUTCString().slice(0, -4));
		const message = {
			github: await Github(),
			jenkins: await Jenkins()
		}
		this.messaging.send({
			target: users,
			data: message
		});
		console.log('Done: ', new Date().toUTCString().slice(0, -4));
		this.last_data = message;
	}

	async createUser(user_info: BasicAuthenticatedUser) {
		try {
			await this.simple.createUser(user_info);
		}
		catch(err) {
			console.log(err);
		}
	}

	get_last_data() {
		return (this.last_data);
	}
}
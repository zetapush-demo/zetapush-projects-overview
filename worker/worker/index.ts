import { Simple, Messaging, Groups, Injectable, BasicAuthenticatedUser } from '@zetapush/platform';
import * as Github from './github';
import * as Jenkins from './jenkins';

const GROUP_ID = 'githubGroup';

@Injectable()
export default class NodeRedGithubApi {

	last_data: object;

	/**
	 * Create the conversation of the chat, if doesn't already exists
	 */
	async onApplicationBootstrap() {
		const { exists } = await this.groups.exists({
			group: GROUP_ID
		});
		if (!exists)
			await this.groups.createGroup({
				group: GROUP_ID
			});
	}

	/**
	 * Constructor of our API
	 */
	constructor(
		private messaging: Messaging,
		private groups: Groups,
		private simple: Simple
	) { }

	/**
	 * Add the current user in the conversation
	 */
	async addMeToConversation(parameters: any, context: any) {
		await this.groups.addUser({
			group: GROUP_ID,
			user: context.owner
		});
	}

	/**
	 * Send a message on the chat
	 * @param {Object} message
	 */
	async sendMessage(message: object = {}, context: any) {
		const group = await this.groups.groupUsers({
			group: GROUP_ID
		});
		const users = group.users || [];
		console.log(users);

		message = {
			github: await Github(),
			jenkins: await Jenkins()
		}
		this.messaging.send({
			target: users,
			data: { message }
		});
		this.last_data = message;
		console.log("msg: ", message);
		return group;
	}

	async createUser(user_info: BasicAuthenticatedUser) {
		console.log('dans le worker');
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
import { Simple, Messaging, Groups, Injectable, ExistenceCheck, BasicAuthenticatedUser } from '@zetapush/platform';

const CONVERSATION_ID = 'githubConv';
const CHANNEL_MESSAGING = 'githubChannel';

@Injectable()
export default class NodeRedGithubApi {

	/**
	 * Create the conversation of the chat, if doesn't already exists
	 */
	async onApplicationBootstrap() {
		const { exists } = await this.groups.exists({
			group: CONVERSATION_ID
		});
		if (!exists)
			await this.groups.createGroup({
				group: CONVERSATION_ID
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
		const output = await this.groups.addUser({
			group: CONVERSATION_ID,
			user: context.owner
		});
		return output;
	}

	/**
	 * Send a message on the chat
	 * @param {Object} message
	 */
	async sendMessage(message: object = {}) {
		// Get all users inside the conversation
		const group = await this.groups.groupUsers({
			group: CONVERSATION_ID
		});
		const users = group.users || [];

		// Send the message to each user in the conversation
		this.messaging.send({
			target: users,
			channel: CHANNEL_MESSAGING,
			data: { message }
		});
		console.log(message);
		return group;
	}

	async createUser(user_info: BasicAuthenticatedUser) {
		await this.simple.createUser(user_info);
	}

	async checkUser(user_info: ExistenceCheck) {
		await this.simple.checkUser(user_info);
	}
}

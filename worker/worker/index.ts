import { Simple, Messaging, Groups, Injectable, ExistenceCheck, BasicAuthenticatedUser } from '@zetapush/platform';

const GROUP_ID = 'githubGroup';

@Injectable()
export default class NodeRedGithubApi {

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
		var output;
		try {
			output = await this.groups.addUser({
				group: GROUP_ID,
				user: context.owner
			});
		}
		catch(err) {
			return err;
		}
		return output;
	}

	/**
	 * Send a message on the chat
	 * @param {Object} message
	 */
	async sendMessage(message: object = {}, context: any) {
		// Get all users inside the conversation
		const group = await this.groups.groupUsers({
			group: GROUP_ID
		});
		const users = group.users || [];
		console.log(users);

		// Send the message to each user in the conversation
		this.messaging.send({
			target: users,
			data: { message }
		});
		console.log("msg: ", message);
		return group;
	}

	async createUser(user_info: BasicAuthenticatedUser) {
		var output;
		try {
			output = await this.simple.createUser(user_info);
		}
		catch(err) {
			return err;
		}
		return (output);
	}

	async checkUser(user_info: ExistenceCheck) {
		var output;
		try {
			output = await this.simple.checkUser(user_info);
		}
		catch(err) {
			return err;
		}
		return (output);
	}

	async memberOf(toto: any, context: any) {
		var output;
		try {
			output = await this.groups.memberOf({
				group: GROUP_ID,
				owner: context.owner
			});
		}
		catch(err) {
			return err;
		}
		return (output);
	}
}
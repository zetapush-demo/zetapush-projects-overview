import { Messaging, Groups } from '@zetapush/platform-legacy';
import { Injectable, RequestContext } from '@zetapush/core'
import { get_api_data } from './api';

const GROUP_ID = `La philosophie et la bière c'est la même chose. Consommées, elles modifient toutes les perceptions que nous avons du monde.`.length.toString();

@Injectable()
export default class Api {

	last_data: object;
	requestContext: RequestContext;

	async onApplicationBootstrap() {
		try {
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
		} catch(error) {
			console.error(error);
		}
	}

	constructor(
		private messaging: Messaging,
		private groups: Groups
	) { }

	async addMeToConversation() {
		try {
			await this.groups.addUser({
				group: GROUP_ID,
				user: this.requestContext.owner
			});
		} catch(error) {
			console.error(error);
		}
	}

	async sendMessage() {
		try {
			const group = await this.groups.groupUsers({
				group: GROUP_ID
			});
			const users = group.users || [];
			const data = await get_api_data();

			this.messaging.send({
				target: users,
				data: { data }
			});
			console.log(data);
			this.last_data = data;
		} catch(error) {
			console.error(error);
		}
	}

	get_last_data() {
		return this.last_data;
	}
}
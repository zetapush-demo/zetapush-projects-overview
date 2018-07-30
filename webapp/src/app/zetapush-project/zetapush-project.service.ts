import { Injectable } from '@angular/core';

import { SmartClient } from '@zetapush/client';
import { Messaging } from '@zetapush/platform';
import { transports} from '@zetapush/cometd/lib/node/Transports';

export interface GithubDataStruct {
	release: string;
	repo: string;
	issues: object[];
	pull_request: object[];
}

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {
	constructor() {}

	client = new SmartClient({
		transports,
		platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
		appName: '2qde3WQU'
	});
	api = this.client.createProxyTaskService();
	githubdata: GithubDataStruct;

	get_data() {
		this.client.createService({
			Type: Messaging,
			listener: {
				githubChannel: ({ data }) => {
					console.log('data: ', data);
					this.githubdata = data;
				}
			}
		});
		this.client.connect().then( async () => {
			const tmp = await this.api.checkUser({key: 'toto'});
			console.log('tmp: ', tmp);
			if (tmp === undefined || tmp === {}) {
				console.log('pk t pas là');
				await this.api.createUser({
					'email': 'pacome.francon@epitech.eu',
					'login': 'angular',
					'password': 'azerty'
				});
				await this.api.addMeToConversation();
			}
		});
		return (this.githubdata);
	}
}

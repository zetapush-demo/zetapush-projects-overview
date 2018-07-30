import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SmartClient } from '@zetapush/client';
import { Messaging } from '@zetapush/platform/lib';
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
	data: GithubDataStruct;
	obs: Observable<GithubDataStruct>;
	next;

	init_observable() {
		this.obs = new Observable<GithubDataStruct>((observer) => {
			this.next = observer.next;
		});
	}

	listen() {
		this.client.createService({
			Type: Messaging,
			listener: {
				githubChannel: ({ data }) => {
					console.log(data);
					this.data = data.data.message.data;
					this.next(this.data);
				}
			}
		});
	}

	connect() {
		this.client.connect().then(async () => {
			const tmp: any = await this.api.checkUser({ key: 'angular' });
			if (tmp.code === 'NO_ACCOUNT') {
				await this.api.createUser({
					'email': 'pacome.francon@epitech.eu',
					'login': 'angular',
					'password': 'azerty'
				});
				await this.api.addMeToConversation();
			}
		});
	}

	get_data(): Observable<GithubDataStruct> {
		return (this.obs);
	}
}

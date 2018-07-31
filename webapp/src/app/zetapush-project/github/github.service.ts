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
		appName: 'V-yugXx9'
	});
	api = this.client.createProxyTaskService();
	data: GithubDataStruct;
	obs: Observable<GithubDataStruct>;
	observer;
	email = 'pacome.francon@epitech.eu';
	login = 'angular';
	password = 'azerty';

	init_observable() {
		this.obs = new Observable<GithubDataStruct>((observer) => {
			this.observer = observer;
			observer.next({
				release: 'v2000',
				repo: 'mdr',
				issues: [{name: 'une super issue', body: 'c\'est l\'histoire d\'un mec'}],
				pull_request: []
			});
		});
	}

	listen() {
		this.client.createService({
			Type: Messaging,
			listener: {
				githubChannel: ({ data }) => {
					console.log('data: ', data);
					this.data = data.data.message.data;
					this.observer.next(this.data);
				}
			}
		});
	}

	connect() {
		this.client.connect().then(async () => {
			const tmp: any = await this.api.checkUser({ key: this.login });
			if (tmp.code === 'NO_ACCOUNT') {
				await this.api.createUser({
					'email': this.email,
					'login': this.login,
					'password': this.password
				});
				await this.api.addMeToConversation();
			}
			await this.client.setCredentials({
				login: this.login,
				password: this.password
			});
			await this.client.connect();
		});
	}

	get_data(): Observable<GithubDataStruct> {
		return (this.obs);
	}
}

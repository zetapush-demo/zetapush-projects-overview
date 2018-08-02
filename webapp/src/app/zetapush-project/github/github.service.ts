import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

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
		appName: 'p2O7rg2w'
	});
	api = this.client.createProxyTaskService();
	data: GithubDataStruct;
	obs: Observable<GithubDataStruct>;
	observer: Subscriber<GithubDataStruct>;
	email = 'pacome.francon@epitech.eu';
	login = 'angular';
	password = 'azerty';

	init_observable() {
		this.obs = new Observable<GithubDataStruct>((observer) => {
			this.observer = observer;
		});
	}

	async get_last_data() {
		const tmp = await this.api.get_last_data();
		console.log('data: ', tmp);
		return (tmp);
	}

	listen() {
		this.client.createService({
			Type: Messaging,
			listener: {
				reply: ({ data }) => this.observer.next(data.data.message.data)
			}
		});
	}

	async weakly_connect() {
		await this.api.createUser({
			'email': this.email,
			'login': this.login,
			'password': this.password
		});
		await this.client.setCredentials({
			login: this.login,
			password: this.password
		});
		await this.client.connect().catch((err) => console.log(err));
		const groups: any = await this.api.memberOf();
		if (groups && !groups.member)
			await this.api.addMeToConversation();
	}

	connect() {
		return new Promise((resolve) => {
			this.client.connect().then(async () => {
				if (!this.client.isStronglyAuthenticated()) {
					console.log('dedzed');
					await this.weakly_connect();
				}
			});
			resolve();
		});
	}

	get_data(): Observable<GithubDataStruct> {
		return (this.obs);
	}
}

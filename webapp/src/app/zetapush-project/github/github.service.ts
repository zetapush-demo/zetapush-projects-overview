import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

import { SmartClient } from '@zetapush/client';
import { Messaging } from '@zetapush/platform/lib';

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
		platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
		appName: '1H5WJI_-'
	});
	api = this.client.createProxyTaskService();
	data: GithubDataStruct;
	obs: Observable<GithubDataStruct>;
	observer: Subscriber<GithubDataStruct>;
	email = 'pacome.francon@zetapush.com';
	login = 'angular';
	password = 'angular';

	init_observable() {
		this.obs = new Observable<GithubDataStruct>((observer) => {
			this.observer = observer;
		});
	}

	async get_last_data() {
		return (await this.api.get_last_data());
	}

	listen() {
		this.client.createService({
			Type: Messaging,
			listener: {
				reply: ({ data }) => this.observer.next(data.data.message.data)
			}
		});
	}

	async smart_connect() {
		await this.api.createUser({
			'email': this.email,
			'login': this.login,
			'password': this.password
		});
		await this.client.setCredentials({
			login: this.login,
			password: this.password
		});
		await this.client.connect();
		await this.api.addMeToConversation();
	}

	async connect() {
		await this.client.connect();
		if (!this.client.isStronglyAuthenticated())
			await this.smart_connect();
	}

	get_data(): Observable<GithubDataStruct> {
		return (this.obs);
	}
}

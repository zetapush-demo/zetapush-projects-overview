import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

import { SmartClient, ProxyService } from '@zetapush/client';
import { Messaging } from '@zetapush/platform/lib';

export interface GithubDataStruct {
	release: string;
	repo: string;
	issues: object[];
	pull_request: object[];
}

export interface JenkinsDataStruct {
	branchs: object[],
	name: string,
	description: string,
	url: string
}

export interface JiraDataStruct {
	issues: IssuesDataStruct[];
	sprint: SprintDataStruct[];
}

interface SprintDataStruct {
	start: string;
	end: string;
	project: string;
	sprint: string;
	issues: IssuesDataStruct[];
}

interface IssuesDataStruct {
	created: string;
	issuetype: {
		iconUrl: string;
		name: string;
	};
	priority: {
		id: number;
		iconUrl: string;
	};
	reporter: {
		avatarUrls: string;
		displayName: string;
		emailAddress: string;
	};
	assignee?: {
		avatarUrls: string;
		displayName: string;
		emailAddress: string;
	};
	status: {
		name: string;
		id: number;
	};
	subtasks?: IssuesDataStruct[];
	summary: string;
	description?: string;
}

export interface DataStruct {
	github: GithubDataStruct;
	jenkins: JenkinsDataStruct[];
	jira: JiraDataStruct;
}

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {
	constructor() {}

	client = new SmartClient({
		platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
		appName: 'YcBd4O_X'
	});
	api: ProxyService = this.client.createProxyTaskService();
	data: DataStruct;
	obs: Observable<DataStruct>;
	observer: Subscriber<DataStruct>;
	email = 'pacome.francon@zetapush.com';
	login = 'angular';
	password = 'angular';

	init_observable() {
		this.obs = new Observable((observer) => {
			this.observer = observer;
		});
	}

	async get_last_data() {
		return await this.api.get_last_data();
	}

	async listen() {
		await this.client.createService({
			Type: Messaging,
			listener: {
				reply: ({ data }) => this.observer.next(data.data)
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

	get_data(): Observable<DataStruct> {
		return this.obs;
	}
}

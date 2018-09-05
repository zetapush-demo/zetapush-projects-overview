import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

import { SmartClient, ProxyService } from '@zetapush/client';
import { Messaging } from '@zetapush/platform/lib';

export interface DataStruct {
	github: Github[];
	jenkins: Jenkins[];
	jira: Jira;
}

export interface Github {
	release: string;
	repo: string;
	issues: GithubIssue[];
	pull_request: PullRequest[];
}

export interface Jenkins {
	branchs: JenkinsBranch[],
	name: string,
	description: string,
	url: string
}

export interface Jira {
	issues: JiraIssue[];
	sprint: JiraSprint[];
}

interface GithubIssue {
	assignees: {
		login: string;
		avatar_url: string;
	}[];
	body: string;
	created: string;
	id: number;
	labels: {
		color: string;
		name: string;
	}[];
	message?: string;
	name: string;
	url: string;
	user: {
		avatar: string;
		name: string;
		url: string;
	}
}

interface PullRequest extends GithubIssue {
	base: string;
	head: string;
}

interface JenkinsBranch {
	branch_url: string;
	name: string;
	time: string;
	last_build: {
		description: string;
		icon: string;
		score: number;
		url: string;
		in_progress?: boolean;
	}
}

interface JiraSprint {
	start: string;
	end: string;
	project: string;
	sprint: string;
	issues: JiraIssue[];
	time: {
		estimate: number;
		remaining: number;
		spent: number;
	}
}

interface JiraIssue {
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
	};
	assignee?: {
		avatarUrls: string;
		displayName: string;
	};
	status: string;
	subtasks?: JiraIssue[];
	summary: string;
	description?: string;
}

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {
	constructor() {}

	client = new SmartClient({
		platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
		appName: 'oJjkJCOM'
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

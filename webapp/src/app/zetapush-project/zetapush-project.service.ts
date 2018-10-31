import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SmartClient, ProxyService } from '@zetapush/client';
import { Messaging } from '@zetapush/platform-legacy/lib/';

export interface DataStruct {
	name: string;
	tools: {
		github?: Github;
		jenkins?: Jenkins;
		jira?: Jira;
	}
}

export interface Github {
	name: string;
	url: string;
	tag: string;
	issues: GithubIssue[];
	pull_request: PullRequest[];
}

export interface Jenkins {
	branches: JenkinsBranch[],
	name: string,
	description: string,
	url: string
}

export interface Jira {
	name: string;
	sprint?: {
		name: string;
		url: string
		sprint: JiraSprint[];
	};
	tracker?: {
		name: string;
		url: string
		tracker: JiraIssue[];
	};
}

export interface GithubIssue {
	assignees: {
		login: string;
		avatar_url: string;
	}[];
	body: string;
	created: string;
	timestamp: number;
	id: number;
	labels: {
		color: string;
		name: string;
	}[];
	name: string;
	url: string;
	user: {
		avatar: string;
		name: string;
		url: string;
	}
}

export interface FilterForm {
	selected: string;
	available_list: string[];
	placeholder: string;
};

export interface PullRequest extends GithubIssue {
	base: string;
	head: string;
	build: JenkinsBranch;
}

export interface JenkinsBranch {
	flow: {
		duration: number;
		id: number;
		name: string;
		result: string;
		state: string;
		type: string;
	}[];
	github_url: string;
	icon: string;
	name: string;
	result: string;
	time: {
		duration: string;
		end: string;
		start: string;
	};
	url: string;
	in_progress?: boolean;
}

export interface JiraSprint {
	start: string;
	end: string;
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
	description?: string;
	issuetype: {
		iconUrl: string;
		name: string;
	};
	key: string;
	priority: {
		iconUrl: string;
		id: number;
	};
	reporter: {
		avatarUrls: string;
		displayName: string;
	};
	status: string;
	subtasks?: JiraIssue[];
	summary: string;
	url: string;
}

interface Credentials {
	email: string;
	login: string;
	password: string;
}

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {

	client: SmartClient;
	api: ProxyService;
	data: DataStruct[];
	observer: Subject<DataStruct[]> = new Subject();
	credentials: Credentials;

	constructor() {
		const config_file = require('../../../../worker/application.json');

		this.client = new SmartClient(config_file.SmartClient);
		this.credentials = config_file.SmartClient_credentials;
		this.api = this.client.createProxyTaskService();
	}

	async get_last_data() {
		return await this.api.get_last_data().catch(err => console.log(err));
	}

	async listen() {
		await this.client.createService({
			Type: Messaging,
			listener: {
				reply: ({ data }) => this.observer.next(data.data.data)
			}
		});
	}

	async smart_connect() {
		try {
			await this.api.createUser(this.credentials);
			await this.client.setCredentials({
				login: this.credentials.login,
				password: this.credentials.password
			});
			await this.client.connect();
			await this.api.addMeToConversation();
		}
		catch(err) {
			console.log(err);
		}
	}

	async connect() {
		try {
			await this.client.connect();
			if (!this.client.isStronglyAuthenticated())
				await this.smart_connect();
		}
		catch(err) {
			console.log(err);
		}
	}
}

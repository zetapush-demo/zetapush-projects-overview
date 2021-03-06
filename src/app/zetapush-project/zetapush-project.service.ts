import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SmartClient, ProxyTaskService } from '@zetapush/client';
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

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {

	client: SmartClient = new SmartClient();
	api: ProxyTaskService = this.client.createProxyTaskService();
	data: DataStruct[];
	observer: Subject<DataStruct[]> = new Subject();

	async get_last_data() {
		return await this.api.get_last_data().catch(err => console.error(err));
	}

	async listen() {
		await this.client.createService({
			Type: Messaging,
			listener: {
				reply: ({ data }) => this.observer.next(data.data.data)
			}
		});
	}

	async connect() {
		try {
			await this.client.connect();
			await this.api.addMeToConversation();
		} catch (error) {
			console.error(error);
		}
	}
}

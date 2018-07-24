import { Component, OnInit } from '@angular/core';

import { MarkdownService } from 'ngx-markdown';

import { GithubDataStruct, ZetapushProjectService } from '../zetapush-project.service';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	url = 'http://127.0.0.1:1880/github';
	data: GithubDataStruct;
	gap_refresh = 900000;

	last_issues: number;
	last_pull_request: number;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private md: MarkdownService
	) { }

	check_new_data(tab) {
		const now = new Date().valueOf();

		for (var i = 0; i < tab.length; i++) {
			const gap = new Date(tab[i].created).valueOf() - now;
			if (-gap < this.gap_refresh)
				return (i);
		}
		return (-1);
	}

	on_get_data(tmp) {
		this.data = {
			release: tmp['release'],
			repo: tmp['repo'],
			issues: tmp['issues'],
			pull_request: tmp['pull_request']
		};
		this.last_issues = this.check_new_data(this.data.issues);
		this.last_pull_request = this.check_new_data(this.data.pull_request);
		if (this.last_issues !== -1)
			console.log(this.data.issues[this.last_issues]);
		if (this.last_pull_request !== -1)
			console.log(this.data.pull_request[this.last_pull_request]);
	}

	get_data() {
		this.zetapush_service.get_data(this.url).subscribe(
			(tmp: GithubDataStruct) => this.on_get_data(tmp)
		);
	}

	ngOnInit() {
		this.get_data();
		setInterval(() => {
			this.get_data();
		}, this.gap_refresh);
	}
}

import { Component, OnInit } from '@angular/core';

import { MarkdownService } from 'ngx-markdown';

import { github_data_struct, ZetapushProjectService } from './zetapush-project.service';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.css'],
	providers: [ZetapushProjectService],
})

export class ZetapushProjectComponent implements OnInit {

	constructor(private zetapush_service: ZetapushProjectService,
		    private md: MarkdownService) { };

	github_url: string = 'http://127.0.0.1:1880/github';
	github_data: github_data_struct;

	get_github_data() {
		this.zetapush_service.get_github_data(this.github_url)
			.subscribe((tmp: github_data_struct) => {
				this.github_data = {
					release: tmp['release'],
					repo: tmp['repo'],
					issues: tmp['issues'],
					pull_request: tmp['pull_request']
				}
			});
	}
	ngOnInit() {
		this.get_github_data();
		setInterval(() => {
			this.get_github_data();
		}, 900000);
	}
}

import { Component, OnInit } from '@angular/core';

import { MarkdownService } from 'ngx-markdown';

import { data_struct, ZetapushProjectService } from './zetapush-project.service';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.css'],
	providers: [ZetapushProjectService],
})

export class ZetapushProjectComponent implements OnInit {

	constructor(private zetapush_service: ZetapushProjectService,
		    private md: MarkdownService) { };

	url: string = 'http://127.0.0.1:1880/github';
	data: data_struct;

	ngOnInit() {
		function foo(bar) {
			bar.zetapush_service.get_data(bar.url)
				.subscribe((tmp: data_struct) => {
					bar.data = {
						release: tmp['release'],
						repo: tmp['repo'],
						issues: tmp['issues'],
						pull_request: tmp['pull_request']
					}
				});
		}
		setInterval(() => {
			foo(this);
		}, 1000);
	}
}

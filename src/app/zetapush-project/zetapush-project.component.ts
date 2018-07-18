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
		this.zetapush_service.get_data(this.url)
			.subscribe((tmp: data_struct) => {
				this.data = {
					release: tmp['release'],
					repo: tmp['repo'],
					issues: tmp['issues']
				}
			});
	}
}

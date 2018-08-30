import { Component, OnInit } from '@angular/core';

import { ZetapushProjectService, DataStruct, Jira } from '../zetapush-project.service';

@Component({
	selector: 'app-jira',
	templateUrl: './jira.component.html',
	styleUrls: ['./jira.component.css']
})
export class JiraComponent implements OnInit {

	data: Jira;
	constructor(
		private zetapush_service: ZetapushProjectService,
	) { }

	on_get_data(tmp: Jira) {
		if (!tmp)
			return;
		this.data = tmp;
		console.log(tmp.sprint[0].issues);
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['jira']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.jira)
		);
	}
}
import { Component, OnInit, Input } from '@angular/core';

import { Jira } from '../zetapush-project.service';

@Component({
	selector: 'app-jira',
	templateUrl: './jira.component.html',
	styleUrls: ['./jira.component.css']
})
export class JiraComponent implements OnInit {

	@Input() data: Jira;

	constructor() { }

	ngOnInit() {
		if (!this.data)
			return;
		console.log(this.data);
	}
}
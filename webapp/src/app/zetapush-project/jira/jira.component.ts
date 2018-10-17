import { Component, Input } from '@angular/core';

import { Jira } from '../zetapush-project.service';

@Component({
	selector: 'app-jira',
	templateUrl: './jira.component.html',
	styleUrls: ['./jira.component.css']
})
export class JiraComponent {
	@Input() data: Jira;
}
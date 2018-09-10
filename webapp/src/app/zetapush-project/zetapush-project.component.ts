import { Component } from '@angular/core';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.css']
})
export class ZetapushProjectComponent {

	navlinks = [
		{
			path: '/github',
			name: 'github',
			icon: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
		},
		{
			path: '/jenkins',
			name: 'jenkins',
			icon: 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/images/jenkins-redbg.png'
		},
		{
			path: '/jira',
			name: 'jira',
			icon: 'https://wac-cdn.atlassian.com/dam/jcr:37f03d61-2cfc-4862-b536-ca6d200e7cf8/Jira%20Software-icon-blue.svg?cdnVersion=jw'
		},
	];

	constructor() {}
}

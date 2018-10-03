import { Component, OnInit } from '@angular/core';

import { MonitoringComponent, MachineGroup } from '../monitoring/monitoring.component';
import { ZetapushProjectService, DataStruct, GithubIssue, JenkinsBranch, JiraSprint } from '../zetapush-project/zetapush-project.service';

@Component({
	selector: 'app-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

	jira: JiraSprint;
	jenkins: JenkinsBranch[];
	github: GithubIssue[];
	machine_group: MachineGroup[];
	accept_machine = ['dev', 'hq', 'prod', 'celtia'];

	constructor(
		private monitoring: MonitoringComponent,
		private zetapush_service: ZetapushProjectService
	) { }

	on_get_data(tmp: DataStruct) {
		if (!tmp)
			return;
		this.github = tmp.github.find(x => x.name === 'zetapush').issues.slice(0, 5);
		this.jenkins = tmp.jenkins.find(x => x.name === 'zetapush').branches.filter(x => x.name === 'master' || x.name === 'develop');
		this.jira = tmp.jira.find(x => x.project === 'PLATEFORME-V3').sprint[0];
		console.log({
			github: this.github,
			jenkins: this.jenkins,
			jira: this.jira
		});
	}

	async ngOnInit() {
		this.machine_group = this.monitoring.machines.filter(x => this.accept_machine.find(y => y === x.env))
		const tmp: any = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct) => this.on_get_data(data)
		);
	}
}

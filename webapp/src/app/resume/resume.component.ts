import { Component, OnInit } from '@angular/core';

import { MachineGroup, Machine } from '../monitoring/monitoring.component';
import { ZetapushProjectService, DataStruct, GithubIssue, JenkinsBranch, JiraSprint } from '../zetapush-project/zetapush-project.service';

@Component({
	selector: 'app-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

	jira: JiraSprint[];
	jenkins: JenkinsBranch[];
	github: GithubIssue[];
	machine_group: MachineGroup[];

	constructor(
		private zetapush_service: ZetapushProjectService
	) { }

	xhr_callback(xhr: XMLHttpRequest, machine: Machine, machine_group: MachineGroup) {
		return () => {
			if (xhr.readyState == 4) {
				if (xhr.status !== 200) {
					machine_group['color'] = '#f15b3e';
					machine_group['fail'].push(machine.name);
				}
			}
		};
	}

	send_request(machine: Machine, machine_group: MachineGroup) {
		const xhr = new XMLHttpRequest();

		machine_group['fail'] = [];
		machine_group['color'] = '#86c65b';
		xhr.onreadystatechange = this.xhr_callback(xhr, machine, machine_group);
		xhr.open('GET', machine.url, true);
		xhr.send(null);
	}

	refreshStatus() {
		for (var i = 0; i < this.machine_group.length; i++) {
			for (var j = 0; j < this.machine_group[i].list.length; j++)
				this.send_request(this.machine_group[i].list[j], this.machine_group[i]);
		}
	}

	on_get_data(tmp: DataStruct) {
		if (!tmp || !tmp.github || !tmp.jenkins || !tmp.jira)
			return;
		this.github = tmp.github.find(x => x.name === 'zetapush').issues.slice(0, 5);
		this.jenkins = tmp.jenkins.find(x => x.name === 'zetapush').branches.filter(x => x.name === 'master' || x.name === 'develop');
		this.jira = tmp.jira.find(x => x.name === 'PLATEFORME-V3').sprint;
	}

	async ngOnInit() {
		const config_file = require('../../../../worker/application.json');

		this.machine_group = config_file.machines.filter(x => ['dev', 'hq', 'prod', 'celtia'].find(y => y === x.env));
		this.refreshStatus();
		setInterval(() => {
			this.refreshStatus();
		}, eval(config_file.monitoring_refresh));

		const tmp: any = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct) => this.on_get_data(data)
		);
	}
}

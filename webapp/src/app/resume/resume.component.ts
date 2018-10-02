import { Component, OnInit } from '@angular/core';

import { MonitoringComponent, MachineGroup } from '../monitoring/monitoring.component';
import { ZetapushProjectService, DataStruct } from '../zetapush-project/zetapush-project.service';

@Component({
	selector: 'app-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.sass']
})
export class ResumeComponent implements OnInit {

	data: DataStruct;
	machine_group: MachineGroup[];
	accept_machine = ['dev', 'hq', 'prod', 'celtia'];

	constructor(
		private monitoring: MonitoringComponent,
		private zetapush_service: ZetapushProjectService
	) { }

	on_get_data(tmp: DataStruct) {
		if (!tmp)
			return;
		this.data = tmp;
		console.log(this.data);
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

import { Component, OnInit } from '@angular/core';

export interface MachineGroup {
	env: string;
	list: Machine[];
}

export interface Machine {
	name: string;
	url: string;
	version?: string;
	color?: string;
	status?: number;
}

@Component({
	selector: 'app-monitoring',
	templateUrl: './monitoring.component.html',
	styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

	constructor() { }

	displayedColumns = ['name', 'status', 'version'];
	machines: MachineGroup[];

	xhr_callback(xhr: XMLHttpRequest, machine: Machine) {
		return () => {
			if (xhr.readyState == 4) {
				if (xhr.status !== 200)
					machine['color'] = '#f15b3e';
				else
					machine['color'] = '#86c65b';
				if (xhr.responseText.startsWith('<'))
					machine['version'] = xhr.responseText.split('>')[2].split('<')[0];
				else
					machine['version'] = xhr.responseText;
				machine['status'] = xhr.status;
			}
		};
	}

	send_request(machine: Machine) {
		const xhr = new XMLHttpRequest();

		machine['color'] = 'orange';
		xhr.onreadystatechange = this.xhr_callback(xhr, machine);
		xhr.open('GET', machine.url, true);
		xhr.send(null);
	}

	refreshStatus(select_machine?: string) {
		var tmp = this.machines;

		if (!this.machines)
			return;
		if (select_machine)
			tmp = [this.machines.find(x => x.env === select_machine)];
 		tmp.forEach(machine => {
			machine.list.forEach(machine => this.send_request(machine))
		});
	}

	ngOnInit() {
		const config_file = require('../../../../worker/application.json');
		const interval = eval(config_file.monitoring_refresh);

		if (!interval)
			console.error('"monitoring_refresh" must be a number, default delay is 1 minute');
		this.machines = config_file.machines;
		this.refreshStatus();
		setInterval(() => {
			this.refreshStatus();
		}, interval || 1000 * 60 * 1);
	}
}

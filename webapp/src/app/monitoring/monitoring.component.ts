import { Component, OnInit, Injectable, Input } from '@angular/core';

export interface MachineGroup {
	env: string;
	list: Machine[];
}

interface Machine {
	name: string;
	url: string;
	version?: string;
	color?: string;
}

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-monitoring',
	templateUrl: './monitoring.component.html',
	styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

	constructor() { }

	displayedColumns = ['name', 'status', 'version'];
	@Input() machines: MachineGroup[] = [
		{
			env: 'dev',
			list: [
				{
					name: 'Dev ZBO',
					url: 'http://pinte-silver-2:8080/zbo/',
				},
				{
					name: 'Dev STR',
					url: 'http://pinte-silver-2:8080/str/'
				}

			]
		},
		{
			env: 'dev2',
			list: [
				{
					name: 'Dev2 STR 1',
					url: 'http://vm-str-dev-1:8080/str/'
				},
				{
					name: 'Dev2 STR 2',
					url: 'http://vm-str-dev-2:8080/str/'
				},
				{
					name: 'Dev2 STR 3',
					url: 'http://vm-str-dev-3:8080/str/'
				}
			]
		},
		{
			env: 'vm',
			list: [
				{
					name: 'vm-0',
					url: 'http://pinte-silver-2-vm-0:8080/str/'
				}
			]
		},
		{
			env: 'pre_prod',
			list: [
				{
					name: 'Pre-prod ZBO',
					url: 'http://vm-zbo:8080/zbo/'
				},
				{
					name: 'Pre-prod STR 1',
					url: 'http://vm-str-1:8080/str/'
				},
				{
					name: 'Pre-prod STR 2',
					url: 'http://vm-str-2:8080/str/'
				},
				{
					name: 'Pre-prod thumbs pinte',
					url: 'http://pinte-silver-1:10010/'
				},
				{
					name: 'Pre-prod docker builder',
					url: 'http://vm-str-2:8080/str/'
				},
				{
					name: 'Pre-prod thumbs str-1',
					url: 'http://vm-str-1:10010/'
				},
				// {
				// 	name: 'Pre-prod Admin',
				// 	url: 'http://preprodzbo.zpush.ovh'
				// },
				// {
				// 	name: 'Pre-prod ES',
				// 	url: 'http://pinte-silver-3:9200/'
				// }
			]
		},
		{
			env: 'hq',
			list: [
				{
					name: 'HQ ZBO',
					url: 'http://hq.zpush.io:9080/zbo/'
				},
				{
					name: 'HQ STR 1',
					url: 'http://hq.zpush.io:9081/str/'
				},
				{
					name: 'HQ STR 2',
					url: 'http://hq.zpush.io:9082/str/'
				}
			]
		},
		{
			env: 'prod',
			list: [
				{
					name: 'Prod ZBO',
					url: 'http://zbo.zpush.io/zbo/'
				},
				{
					name: 'Prod Free STR 1',
					url: 'http://free-1.zpush.io/str/'
				},
				{
					name: 'Prod Cluster 1 STR 1',
					url: 'http://cluster-1-str-1.zpush.io/str/'
				},
				{
					name: 'Prod Cluster 1 STR 2',
					url: 'http://cluster-1-str-2.zpush.io/str/'
				},
				{
					name: 'Prod Cluster 1 STR 2',
					url: 'http://cluster-1-str-2.zpush.io/str/'
				},
				{
					name: 'Prod Admin',
					url: 'https://admin.zpush.io'
				}
			]
		},
		{
			env: 'celtia',
			list: [
				{
					name: 'Celtia alpha ZBO',
					url: 'http://celtia.zetapush.com/zbo/'
				},
				{
					name: 'Celtia alpha STR',
					url: 'http://celtia.zetapush.com/str/'
				}
			]
		},
		{
			env: 'demo',
			list: [
				// {
				// 	name: 'Demo platform 1 (OVH)',
				// 	url: 'http://demo-1.zpush.io'
				// },
				{
					name: 'Demo platform ZBO',
					url: 'http://demo-1.zpush.io/zbo/'
				},
				{
					name: 'Demo platform STR',
					url: 'http://demo-1.zpush.io/str/'
				},
				// {
				// 	name: 'Demo platform 2 (kimsufi)',
				// 	url: 'demo-2.zpush.io'
				// },
				// {
				// 	name: 'Demo platform ZBO',
				// 	url: 'http://demo-2.zpush.io/zbo/'
				// },
				// {
				// 	name: 'Demo platform STR',
				// 	url: 'http://demo-2.zpush.io/str/'
				// },
			]
		},
		{
			env: 'biosency_demo',
			list: [
				// {
				// 	name: 'Biosency Demo platform (online)',
				// 	url: 'biosency-demo-backend.zpush.io'
				// },
				{
					name: 'Biosency Demo platform ZBO',
					url: 'http://biosency-demo-backend.zpush.io/zbo/'
				},
				{
					name: 'Biosency Demo platform STR',
					url: 'http://biosency-demo-backend.zpush.io/str/'
				}
			]
		}
	];

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

		if (select_machine)
			tmp = [this.machines.find(x => x.env === select_machine)];
 		tmp.forEach(machine => {
			machine.list.forEach(machine => this.send_request(machine))
		});
	}

	ngOnInit() {
		this.refreshStatus();
		setInterval(() => {
			this.refreshStatus();
		}, 1000 * 60 * 15); // 15 minutes
	}
}

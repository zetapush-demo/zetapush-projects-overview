import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-monitoring',
	templateUrl: './monitoring.component.html',
	styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

	constructor() {
	}

	machines = [
		{
			env: "dev",
			machine: [
				{
					name: 'Dev ZBO',
					url: 'http://pinte-silver-2:8080/zbo/'
				},
				{
					name: 'Dev STR',
					url: 'http://pinte-silver-2:8080/str/'
				}
			]
		},
		{
			env: 'dev2',
			machine: [
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
			machine: [
				{
					name: 'vm-0',
					url: 'http://pinte-silver-2-vm-0:8080/str/'
				}
			]
		},
		{
			env: 'pre_prod',
			machine: [
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
				{
					name: 'Pre-prod Admin',
					url: 'http://preprodzbo.zpush.ovh'
				},
				{
					name: 'Pre-prod ES',
					url: 'http://pinte-silver-3:9200/'
				}
			]
		},
		{
			env: 'hq',
			machine: [
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
			machine: [
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
					url: 'http://admin.zpush.io'
				}
			]
		},
		{
			env: 'celtia',
			machine: [
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
			machine: [
				{
					name: 'Demo platform 1 (OVH)',
					url: 'demo-1.zpush.io'
				},
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
			machine: [
				{
					name: 'Biosency Demo platform (online)',
					url: 'biosency-demo-backend.zpush.io'
				},
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

	ngOnInit() {
		this.adminLinks();
		this.refreshStatus();
	}

	adminLinks() {
		const elements: any = document.querySelectorAll('[zeta-admin]');

		for (var i = 0; i < elements.length; i++) {
			var url = elements[i].parentNode.children[1].firstChild.href;

			elements[i].innerHTML = `<a href="${url}browse/" target="_blank"> Open </a>`;
		}
	}

	callback(element, xhr, url) {
		return () => {
			if (xhr.readyState == 4) {
				if (xhr.status !== 200)
					console.log(`status : ${xhr.status} - ${url}`);
				this.showStatus(element, xhr.responseText, xhr.status === 200);
			}
		};
	}

	refreshStatus() {
		const elements: any = document.querySelectorAll('[zeta-status]');

		for (var i = 0; i < elements.length; i++) {
			var url = elements[i].parentNode.children[1].firstChild.href;
			var xhr = new XMLHttpRequest();

			this.showStatus(elements[i], 'pending', 'pending');
				xhr.onreadystatechange = this.callback(elements[i], xhr, url)
					xhr.open('GET', url, true);
			xhr.send(null);
		}
	}

	showStatus(node, status, success) {
		if (status.startsWith('<'))
			node.innerHTML = status;
		else
			node.innerText = status;
		node.classList.remove('zf');
		node.classList.remove('ze');
		node.classList.remove('zt');
		node.classList.remove('zw');
		if (success === 'pending')
			node.classList.add('zw');
		else if (success)
			node.classList.add('zt');
		else
			node.classList.add('ze');
	}
}

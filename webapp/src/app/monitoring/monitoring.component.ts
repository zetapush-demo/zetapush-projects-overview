import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-monitoring',
	templateUrl: './monitoring.component.html',
	styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

	constructor() {
	}

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

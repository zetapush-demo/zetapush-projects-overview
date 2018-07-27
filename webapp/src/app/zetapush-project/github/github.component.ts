import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { GithubDataStruct, ZetapushProjectService } from '../zetapush-project.service';
import { PopupComponent } from './popup/popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	url = 'http://127.0.0.1:1880/github';
	data: GithubDataStruct;
	gap_refresh = 900000;

	new_issues: object;
	new_pull_request: object;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog() {
		this.dialog.open(PopupComponent, {
			width: '500px',
			data: {
				new_issues: this.new_issues,
				new_pull_request: this.new_pull_request
			}
		});
	}

	get_new_data(tab) {
		const now = new Date().valueOf();

		if (tab)
			for (var i = 0; i < tab.length; i++) {
				const gap = new Date(tab[i].created).valueOf() - now;

				if (-gap < this.gap_refresh)
					return (tab[i]);
			}
		return (undefined);
	}

	on_get_data(tmp) {
		this.data = {
			release: tmp['release'],
			repo: tmp['repo'],
			issues: tmp['issues'],
			pull_request: tmp['pull_request']
		};
		this.new_issues = this.get_new_data(this.data.issues);
		this.new_pull_request = this.get_new_data(this.data.pull_request);
		if (this.new_issues !== undefined)
			this.openDialog();
		else if (this.new_pull_request !== undefined)
			this.openDialog();
	}

	get_data() {
		const tmp = this.zetapush_service.get_data();
		this.on_get_data(tmp);
	}

	ngOnInit() {
		this.get_data();
		setInterval(() => {
			this.get_data();
		}, this.gap_refresh);
	}
}
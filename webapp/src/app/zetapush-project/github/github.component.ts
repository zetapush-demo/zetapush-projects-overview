import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { GithubDataStruct, ZetapushProjectService, DataStruct } from '../zetapush-project.service';
import { PopupComponent } from './popup/popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

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
		return (null);
	}

	on_get_data(tmp: GithubDataStruct) {
		console.log(tmp);
		if (!tmp)
			return;
		this.data = tmp;
		this.new_issues = this.get_new_data(this.data.issues);
		this.new_pull_request = this.get_new_data(this.data.pull_request);
		if (this.new_issues !== null)
			this.openDialog();
		else if (this.new_pull_request !== null)
			this.openDialog();
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['data'].github);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

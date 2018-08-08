import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { JenkinsDataStruct, ZetapushProjectService, DataStruct } from '../zetapush-project.service';
import { PopupComponent } from './popup/popup.component';

@Component({
	selector: 'app-jenkins',
	templateUrl: './jenkins.component.html',
	styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent implements OnInit {

	data: JenkinsDataStruct;
	gap_refresh = 900000;

	branch_new_build: object;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(branch_new_build) {
		this.dialog.open(PopupComponent, {
			width: '500px',
			data: branch_new_build
		});
	}

	get_new_data(tab) {
		const now = new Date().valueOf();

		if (!tab)
			return null;
		tab.forEach(app => {
			app.branchs.forEach(branch => {
				const gap = branch.time - now;

				if (-gap < this.gap_refresh)
					return branch;
			})
		});
		return null;
	}

	stringify_date(tmp: any) {
		tmp.forEach(app => {
			app.branchs.forEach(branch => {
				branch.time = new Date(branch.time).toDateString();
			});
		});
	}

	on_get_data(tmp) {
		console.log(tmp);
		if (!tmp)
			return;
		this.stringify_date(tmp);
		this.data = tmp;
		const branch_new_build = this.get_new_data(this.data);
		if (branch_new_build !== null)
			this.openDialog(branch_new_build);
	}


	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['data'].jenkins);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.jenkins)
		);
	}
}

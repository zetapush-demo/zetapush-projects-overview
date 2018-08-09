import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { JenkinsDataStruct, ZetapushProjectService, DataStruct } from '../zetapush-project.service';
import { JenkinsPopupComponent } from './popup/jenkins-popup.component';

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
		this.dialog.open(JenkinsPopupComponent, {
			width: '500px',
			data: branch_new_build
		});
	}

	get_new_data(tab) {
		const now = new Date().valueOf();

		if (!tab)
			return null;
		for (let i = 0; i < tab.length; i++) {
			for (let j = 0; j < tab[i].branchs.length; j++) {
				var gap = tab[i].branchs[j].time - now;

				if (-gap < this.gap_refresh)
					return tab[i].branchs[j];
			}
		}
		return null;
	}

	stringify_date(tmp: any) {
		tmp.forEach(app => {
			app.branchs.forEach(branch => {
				branch.time = new Date(branch.time).toUTCString().slice(0, -4);
			});
		});
	}

	on_get_data(tmp) {
		console.log(tmp);
		if (!tmp)
			return;
		this.data = tmp;
		const branch_new_build = this.get_new_data(this.data);
		this.stringify_date(this.data);
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

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

	new_build: object;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog() {
		this.dialog.open(PopupComponent, {
			width: '500px',
			data: {
				new_build: this.new_build,
			}
		});
	}

	get_new_data(tab) {
		const now = new Date().valueOf();

		if (tab)
			for (var i = 0; i < tab.length; i++) {
				const gap = new Date(tab[i].time).valueOf() - now;

				if (-gap < this.gap_refresh)
					return (tab[i]);
			}
		return (null);
	}

	on_get_data(tmp) {
		console.log(tmp);
		if (!tmp)
			return;
		tmp.forEach(app => {
			app.branchs.forEach(branch => {
				branch.time = new Date(branch.time).toDateString();
			});
		});
		this.data = tmp;
		this.new_build = this.get_new_data(this.data);
		if (this.new_build !== null)
			this.openDialog();
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['data'].jenkins);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.jenkins)
		);
	}
}

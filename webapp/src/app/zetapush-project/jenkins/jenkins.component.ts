import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ZetapushProjectService, DataStruct, Jenkins } from '../zetapush-project.service';
import { JenkinsPopupComponent } from './popup/jenkins-popup.component';

@Component({
	selector: 'app-jenkins',
	templateUrl: './jenkins.component.html',
	styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent implements OnInit {

	data: Jenkins[];

	is_dialog_open: boolean = false;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(branch_new_build) {
		var dialog_ref;

		if (!this.is_dialog_open) {
			dialog_ref = this.dialog.open(JenkinsPopupComponent, {
				width: '500px',
				data: branch_new_build
			});
			this.is_dialog_open = true;
			dialog_ref.afterClosed().subscribe(() => this.is_dialog_open = false);
		}
	}

	get_new_data(tab) {
		if (!tab)
			return null;
		for (let i = 0; i < tab.length; i++)
			for (let j = 0; j < tab[i].branchs.length; j++)
				if (tab[i].branchs[j].last_build.in_progress)
					return {
						project: tab[i].name,
						branch: tab[i].branchs[j]
					};
		return null;
	}

	on_get_data(tmp: Jenkins[]) {
		if (!tmp)
			return;
		console.log(tmp);
		this.data = tmp;
		const branch_new_build = this.get_new_data(this.data);
		if (branch_new_build !== null)
			this.openDialog(branch_new_build);
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['jenkins']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.jenkins)
		);
	}
}

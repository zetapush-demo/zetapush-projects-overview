import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';

import { ZetapushProjectService, DataStruct, Jenkins, JenkinsBranch } from '../zetapush-project.service';
import { JenkinsPopupComponent } from './popup/jenkins-popup.component';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-jenkins',
	templateUrl: './jenkins.component.html',
	styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent implements OnInit {

	data: Jenkins[];
	branches_save: JenkinsBranch[][];

	is_dialog_open = false;

	index: FormControl = new FormControl(0);
	length: number[] = [];
	pageSize: number[] = [];

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	paginator_branches(pageEvent: PageEvent, index: number) {
		const data = this.data[index];

		data.branches = JSON.parse(JSON.stringify(this.branches_save[index]));
		data.branches = data.branches.filter((branch, index) => {
			if (index > (pageEvent.pageIndex * pageEvent.pageSize - 1) && index < (pageEvent.pageIndex * pageEvent.pageSize + pageEvent.pageSize))
				return branch;
		});
	}

	openDialog(branch_new_build) {
		var dialog_ref;

		if (!this.is_dialog_open) {
			dialog_ref = this.dialog.open(JenkinsPopupComponent, {
				width: '600px',
				data: branch_new_build
			});
			this.is_dialog_open = true;
			dialog_ref.afterClosed().subscribe(() => this.is_dialog_open = false);
		}
	}

	get_new_data(tab: Jenkins[]) {
		if (!tab)
			return null;
		for (var i = 0; i < tab.length; i++)
			for (var j = 0; j < tab[i].branches.length; j++)
				if (tab[i].branches[j].in_progress)
					return {
						project: tab[i].name,
						branch: tab[i].branches[j]
					};
		return null;
	}

	on_get_data(tmp: Jenkins[]) {
		if (!tmp)
			return;
		console.log(tmp);
		this.data = tmp;
		this.branches_save = JSON.parse(JSON.stringify(tmp.map(x => x.branches)));
		this.length = tmp.map(x => x.branches.length);
		this.paginator_branches({
			pageIndex: 0,
			length: tmp[0].branches.length,
			pageSize: 5,
		}, 0);
		const branch_new_build = this.get_new_data(this.data);
		if (branch_new_build !== null)
			this.openDialog(branch_new_build);
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp['jenkins']);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct) => this.on_get_data(data.jenkins)
		);
	}
}

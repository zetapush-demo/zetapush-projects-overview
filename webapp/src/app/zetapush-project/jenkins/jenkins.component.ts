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

	unmute(project_name) {
		const ignore: string[] = JSON.parse(localStorage.getItem('jenkins_ignore')) || [];
		const search_item: number = ignore.indexOf(project_name);

		if (search_item !== -1) {
			ignore.splice(search_item, 1);
			localStorage.setItem('jenkins_ignore', JSON.stringify(ignore));
		}
	}

	paginator_branches(pageEvent: PageEvent, index: number) {
		const data = this.data[index];

		data.branches = JSON.parse(JSON.stringify(this.branches_save[index]));
		data.branches = data.branches.filter((branch, index) => {
			if (index > (pageEvent.pageIndex * pageEvent.pageSize - 1) && index < (pageEvent.pageIndex * pageEvent.pageSize + pageEvent.pageSize))
				return branch;
		});
	}

	openDialog(branch_new_build) {
		const ignore: string[] = JSON.parse(localStorage.getItem('jenkins_ignore')) || [];
		var dialog_ref;

		if (!this.is_dialog_open && !ignore.includes(branch_new_build.project)) {
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

	init_paginator(tmp: Jenkins[]) {
		for (var i = 0; i < tmp.length; i++) {
			this.length[i] = tmp[i].branches.length;
			this.pageSize[i] = 5;
			this.paginator_branches({
				pageIndex: 0,
				length: tmp[i].branches.length,
				pageSize: 5,
			}, i);
		}
	}

	on_get_data(tmp: Jenkins[]) {
		if (!tmp)
			return;
		this.data = tmp;
		this.branches_save = JSON.parse(JSON.stringify(this.data.map(x => x.branches)));
		this.init_paginator(this.data);
		const branch_new_build = this.get_new_data(this.data);
		if (branch_new_build !== null)
			this.openDialog(branch_new_build);
		console.log(tmp);
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

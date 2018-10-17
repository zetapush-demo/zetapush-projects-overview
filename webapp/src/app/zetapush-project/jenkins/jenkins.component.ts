import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';

import { Jenkins, JenkinsBranch } from '../zetapush-project.service';
import { JenkinsPopupComponent } from './popup/jenkins-popup.component';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-jenkins',
	templateUrl: './jenkins.component.html',
	styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent implements OnInit {

	@Input() data: Jenkins;
	branches_save: JenkinsBranch[];

	is_dialog_open = false;

	length: number;
	pageSize: number;

	constructor(
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

	paginator_branches(pageEvent: PageEvent) {
		const data = this.data;

		data.branches = JSON.parse(JSON.stringify(this.branches_save));
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

	get_new_data(tab: Jenkins) {
		if (!tab)
			return null;
		for (var i = 0; i < tab.branches.length; i++) {
			if (tab.branches[i].in_progress)
				return {
					project: tab.name,
					branch: tab.branches[i]
				};
		}
		return null;
	}

	init_paginator(tmp: Jenkins) {
		this.length = tmp.branches.length;
		this.pageSize = 5;
		this.paginator_branches({
			pageIndex: 0,
			length: tmp.branches.length,
			pageSize: 5,
		});
	}

	ngOnInit() {
		if (!this.data)
			return;
		this.data = this.data;
		this.branches_save = JSON.parse(JSON.stringify(this.data.branches));
		this.init_paginator(this.data);
		const branch_new_build = this.get_new_data(this.data);

		if (branch_new_build)
			this.openDialog(branch_new_build);
		console.log(this.data);
	}
}

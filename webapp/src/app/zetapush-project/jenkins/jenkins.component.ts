import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';

import { Jenkins, JenkinsBranch } from '../zetapush-project.service';
import { JenkinsPopupComponent } from './popup/jenkins-popup.component';

@Component({
	selector: 'app-jenkins',
	templateUrl: './jenkins.component.html',
	styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent implements OnInit {

	@Input() data: Jenkins;
	branches_save: JenkinsBranch[];
	popup_buffer = [];

	length: number;
	pageSize: number;

	constructor(
		private dialog: MatDialog
	) { }

	paginator_branches(pageEvent: PageEvent) {
		const real_index = pageEvent.pageIndex * pageEvent.pageSize;

		this.data.branches = JSON.parse(JSON.stringify(this.branches_save));
		this.data.branches = this.data.branches.filter((branch, index) => {
			if (index > (real_index - 1) && index < (real_index + pageEvent.pageSize))
				return branch;
		});
	}

	openDialog() {
		for (var i = 0; i < this.popup_buffer.length; i++) {
			this.dialog.open(JenkinsPopupComponent, {
				width: '500px',
				data: this.popup_buffer[i]
			});
		}
		if (this.popup_buffer.length)
			localStorage.setItem(`jenkins_${this.data.name}`, JSON.stringify(this.popup_buffer.map(x => x.branch.name)));
		this.popup_buffer = [];
	}

	popup_on_new_build() {
		const ignore_list: string[] = JSON.parse(localStorage.getItem(`jenkins_${this.data.name}`)) || [];
		const popup_data: any[] = this.data.branches.filter(x => x.in_progress).map(x => {
			return {
				project: this.data.name,
				branch: x
			};
		});
		const filter_data = popup_data.filter(x => !ignore_list.includes(x.branch.name));

		if (filter_data && filter_data.length)
			this.popup_buffer = this.popup_buffer.concat(popup_data);
		if (!popup_data || !popup_data.length)
			localStorage.removeItem(`jenkins_${this.data.name}`);
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
		this.branches_save = JSON.parse(JSON.stringify(this.data.branches));
		this.popup_on_new_build();
		this.init_paginator(this.data);
	}
}

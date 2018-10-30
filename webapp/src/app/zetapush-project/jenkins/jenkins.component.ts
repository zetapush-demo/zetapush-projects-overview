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
	popup_buffer: JenkinsBranch[] = [];

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
			this.popup_buffer[i]['project'] = this.data.name;
			this.dialog.open(JenkinsPopupComponent, {
				width: '500px',
				data: this.popup_buffer[i]
			});
		}
		if (this.popup_buffer.length)
			localStorage.setItem(`jenkins_${this.data.name}`, JSON.stringify(this.popup_buffer.map(x => x.name)));
		this.popup_buffer = [];
	}

	trigger_notif(popup_data: JenkinsBranch[]) {
		const title = `New build on ${this.data.name} !!`;

		if (Notification.permission === 'granted')
			for (var i = 0; i < popup_data.length; i++)
				new Notification(title, { body: popup_data[i].name });
		else
			Notification.requestPermission().then((status) => {
				if (status !== 'granted')
					return;
				for (var i = 0; i < popup_data.length; i++)
					new Notification(title, { body: popup_data[i].name });
			});
	}

	popup_on_new_build() {
		const ignore_list: string[] = JSON.parse(localStorage.getItem(`jenkins_${this.data.name}`)) || [];
		const in_progress_data: JenkinsBranch[] = this.data.branches.filter(x => x.in_progress);
		const filter_data: JenkinsBranch[] = in_progress_data.filter(x => !ignore_list.includes(x.name));

		if (filter_data && filter_data.length) {
			this.popup_buffer = this.popup_buffer.concat(in_progress_data);
			this.trigger_notif(in_progress_data);
		}
		if (!in_progress_data || !in_progress_data.length)
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

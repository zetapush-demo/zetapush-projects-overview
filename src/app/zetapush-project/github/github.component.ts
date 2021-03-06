import { Component, Input, OnInit } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';

import { Github, FilterForm } from '../zetapush-project.service';
import { GithubPopupComponent } from './popup/github-popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	@Input() data: Github;
	data_save: Github;
	popup_buffer = [];

	length: number;
	pageSize: number;

	form_field_name = {
		field: ['assignees', 'labels', 'user'],
		subfield: ['login', 'name', 'name'],
		placeholder: ['Assignee', 'Label', 'User']
	};
	filter_form: FilterForm[];

	constructor(
		private dialog: MatDialog
	) { }

	openDialog() {
		for (var i = 0; i < this.popup_buffer.length; i++) {
			this.popup_buffer[i].message = this.popup_buffer[i].base ? 'New Pull request !!' : 'New Issue !!';
			this.popup_buffer[i].repo_name = this.data.name;
			this.dialog.open(GithubPopupComponent, {
				width: '500px',
				data: this.popup_buffer[i]
			});
		}
		if (this.popup_buffer.length)
			localStorage.setItem(`github_${this.data.name}`, JSON.stringify(this.popup_buffer.map(x => x.id)));
		this.popup_buffer = [];
	}

	trigger_notif(popup_data) {
		const title = `New ${popup_data.base ? 'Pull request' : 'Issue'} on ${this.data.name} !!`;
		const body = popup_data.name;

		if (Notification.permission === 'granted')
			new Notification(title, { body });
		else
			Notification.requestPermission().then((status) => {
				if (status === 'granted')
					new Notification(title, { body });
			});
	}

	popup_on_new_data(delay: number) {
		const gap = new Date().valueOf() - delay;
		const all_data = this.data.issues.concat(this.data.pull_request);
		const last_timestamp = Math.max(...all_data.map(x => x.timestamp));
		const popup_data: any = all_data.find(x => x.timestamp === last_timestamp && x.timestamp > gap);
		const ignore_list: string[] = JSON.parse(localStorage.getItem(`github_${this.data.name}`)) || [];

		if (popup_data && !ignore_list.includes(popup_data.id)) {
			this.popup_buffer.push(popup_data);
			this.trigger_notif(popup_data);
		}
		if (!popup_data)
			localStorage.removeItem(`github_${this.data.name}`);
	}

	paginator_branches(pageEvent: PageEvent) {
		const real_index = pageEvent.pageIndex * pageEvent.pageSize;

		if (this.data.issues.length > pageEvent.pageSize)
			this.data.issues = this.data.issues.filter((branch, index) => {
				if (index > (real_index - 1) && index < (real_index + pageEvent.pageSize))
					return branch;
			});
		if (this.data.pull_request.length > pageEvent.pageSize)
			this.data.pull_request = this.data.pull_request.filter((branch, index) => {
				if (index > (real_index - 1) && index < (real_index + pageEvent.pageSize))
					return branch;
			});
	}

	filter_data_by(formvalue: FilterForm[], pageEvent?: PageEvent) {
		const field: string[] = this.form_field_name.field;
		const subfield: string[] = this.form_field_name.subfield;
		const value: string[] = formvalue.map(x => x.selected); // please trust me

		this.data = JSON.parse(JSON.stringify(this.data_save));
		function callback(elem) {
			var occurrence_counter = 0;

			for (var i = 0; i < value.length; i++) {
				if (!value[i])
					continue;
				if (elem[field[i]].constructor === Array) {
					for (var j = 0; j < elem[field[i]].length; j++)
						if (elem[field[i]][j][subfield[i]] === value[i])
							occurrence_counter++;
				} else
					if (elem[field[i]][subfield[i]] === value[i])
						occurrence_counter++;
			}
			if (occurrence_counter === value.filter(x => x).length)
				return elem;
		};
		this.data.issues = this.data.issues.filter(callback);
		this.data.pull_request = this.data.pull_request.filter(callback);

		if (pageEvent)
			this.pageSize = pageEvent.pageSize;
		this.length = Math.max(this.data.issues.length, this.data.pull_request.length);
		this.paginator_branches(pageEvent || {
			pageIndex: 0,
			length: this.length,
			pageSize: this.pageSize,
		});
	}

	get_list(data: Github, field: string, subfield: string) {
		if (!data)
			return null;
		function filter(tmp) {
			if (tmp.every(x => x[field].constructor === Array))
				return tmp.map(x => x[field].map(y => y[subfield])).join().split(',').filter((x, y, z) => z.indexOf(x) === y && x.length);
			else
				return tmp.map(x => x[field][subfield]).join().split(',').filter((x, y, z) => z.indexOf(x) === y && x.length);
		}
		return filter(data.issues).concat(filter(data.pull_request)).filter((x, y, z) => z.indexOf(x) === y);
	}

	init_form() {
		this.filter_form = [];
		for (var j = 0; j < this.form_field_name.field.length; j++) {
			this.filter_form.push({
				selected: '',
				available_list: this.get_list(this.data, this.form_field_name.field[j], this.form_field_name.subfield[j]),
				placeholder: this.form_field_name.placeholder[j]
			});
		}
	}

	init_paginator(pageSize?: number) {
		this.length = Math.max(this.data.issues.length, this.data.pull_request.length);
		if (pageSize)
			this.pageSize = pageSize;
		this.paginator_branches({
			pageIndex: 0,
			length: this.length,
			pageSize: this.pageSize,
		});
	}

	ngOnInit() {
		this.data_save = JSON.parse(JSON.stringify(this.data));
		this.init_form();
		this.init_paginator(5);
		this.popup_on_new_data(1000 * 60 * 60 * 24 * 7 * 1); // 1 week
	}
}

import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { GithubDataStruct, ZetapushProjectService, DataStruct } from '../zetapush-project.service';
import { GithubPopupComponent } from './popup/github-popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	data: GithubDataStruct;
	data_save: GithubDataStruct;
	gap_refresh = 900000;

	selected_assignee: string;
	assignees_list: string[];

	selected_label: string;
	label_list: string[];

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(popup_data, message) {
		popup_data.message = message;
		console.log(popup_data);
		this.dialog.open(GithubPopupComponent, {
			width: '500px',
			data: popup_data
		});
	}

	popup_on_new_data(gap_refresh) {
		const now = new Date().valueOf();
		var popup_data;

		function get_last_data(tab) {
			if (!tab)
				return null;
			for (var i = 0; i < tab.length; i++) {
				const gap = now - new Date(tab[i].created).valueOf();

				if (gap < gap_refresh)
					return tab[i];
			}
			return null;
		}
		popup_data = get_last_data(this.data.issues);
		if (popup_data !== null)
			return this.openDialog(popup_data, 'New Issue !!');
		popup_data = get_last_data(this.data.pull_request);
		if (popup_data !== null)
			return this.openDialog(popup_data, 'New Pull request !!');
	}

	filter_data_by(value, field, subfield) {
		this.data = JSON.parse(JSON.stringify(this.data_save));
		if (value.length != field.length || field.length != subfield.length)
			return;
		if (field.includes(undefined) || subfield.includes(undefined))
			return;
		function foo(elem) {
			var occurrence_counter = 0;

			if (value.every(x => !x))
				return elem;
			for (var i = 0; i < value.length; i++) {
				if (!value[i])
					continue;
				for (var j = 0; j < elem[field[i]].length; j++)
					if (elem[field[i]][j][subfield[i]] === value[i])
						occurrence_counter++;
			}
			if (occurrence_counter === value.filter(x => x).length)
				return elem;
		};
		this.data.issues = this.data.issues.filter(foo);
		this.data.pull_request = this.data.pull_request.filter(foo);
	}

	get_list(data, field, subfield) {
		if (!data)
			return null;
		function filter(data) {
			return data.filter(x => x[field].length).map(x => x[field].map(y => y[subfield])).join().split(',').filter((x, y, z) => z.indexOf(x) === y);
		}
		return filter(data.issues).concat(filter(data.pull_request)).filter((x, y, z) => z.indexOf(x) === y);
	}

	on_get_data(tmp: GithubDataStruct) {
		if (!tmp)
			return;
		this.data = tmp;
		this.data_save = JSON.parse(JSON.stringify(tmp));
		this.assignees_list = this.get_list(this.data, 'assignees', 'login');
		this.label_list = this.get_list(this.data, 'labels', 'name');
		this.filter_data_by(
			[this.selected_assignee, this.selected_label],
			['assignees', 'labels'],
			['login', 'name']
		);
		console.log(this.data);
		this.popup_on_new_data(this.gap_refresh);
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['github']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

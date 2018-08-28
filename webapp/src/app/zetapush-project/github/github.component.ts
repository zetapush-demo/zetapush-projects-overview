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

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(popup_data) {
		this.dialog.open(GithubPopupComponent, {
			width: '500px',
			data: popup_data
		});
	}

	popup_on_new_data(gap_refresh) {
		const now = new Date().valueOf();
		var popup_data;

		function foo(tab) {
			if (tab)
				for (var i = 0; i < tab.length; i++) {
					const gap = new Date(tab[i].created).valueOf() - now;

					if (gap < gap_refresh)
						return tab[i];
				}
			return null;
		}
		popup_data = foo(this.data.issues);
		if (popup_data !== null)
			return this.openDialog(popup_data);
		popup_data = foo(this.data.pull_request);
		if (popup_data !== null)
			return this.openDialog(popup_data);
	}

	filter_data_by_assignees(assignee_login) {
		console.log('assignee_login: ', assignee_login);
		this.data = JSON.parse(JSON.stringify(this.data_save));
		if (!assignee_login)
			return;
		function foo(data) {
			return data.filter(x => {
				for (var i = 0; i < x.assignees.length; i++)
					if (x.assignees[i].login === assignee_login)
						return x;
			});
		}
		this.data.issues = foo(this.data.issues);
		this.data.pull_request = foo(this.data.pull_request);
	}

	get_assignees_list(data) {
		if (!data)
			return null;
		function foo(data) {
			return data.filter(x => x.assignees.length).map(x => x.assignees.map(y => y.login)).join().split(',').filter((x, y, z) => z.indexOf(x) === y);
		}
		return foo(data.issues).concat(foo(data.pull_request)).filter((x, y, z) => z.indexOf(x) === y);
	}

	on_get_data(tmp: GithubDataStruct) {
		if (!tmp)
			return;
		this.data = tmp;
		this.data_save = JSON.parse(JSON.stringify(tmp));
		this.assignees_list = this.get_assignees_list(this.data);
		this.filter_data_by_assignees(this.selected_assignee);
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

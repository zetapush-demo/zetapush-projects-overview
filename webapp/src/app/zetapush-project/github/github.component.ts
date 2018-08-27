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
	gap_refresh = 900000;

	selected_assignee: string;
	assignees_list: string[];
	new_issues: object;
	new_pull_request: object;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog() {
		this.dialog.open(GithubPopupComponent, {
			width: '500px',
			data: {
				new_issues: this.new_issues,
				new_pull_request: this.new_pull_request
			}
		});
	}

	get_new_data(tab) {
		const now = new Date().valueOf();

		if (tab)
			for (var i = 0; i < tab.length; i++) {
				const gap = new Date(tab[i].created).valueOf() - now;

				if (-gap < this.gap_refresh)
					return tab[i];
			}
		return null;
	}

	filter_data_by_assignees(data, assignee_login) {
		if (!data)
			return null;
		return data.filter(x => {
			for (var i = 0; i < x.assignees.length; i++)
				if (x.assignees[i].login === assignee_login)
					return x;
		});
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
		// console.log(tmp);
		// console.log('filter: ', this.filter_data_by_assignees(tmp.issues, 'damienld22'));
		this.assignees_list = this.get_assignees_list(tmp);
		this.data = tmp;
		this.new_issues = this.get_new_data(this.data.issues);
		this.new_pull_request = this.get_new_data(this.data.pull_request);
		if (this.new_issues !== null)
			this.openDialog();
		else if (this.new_pull_request !== null)
			this.openDialog();
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['github']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

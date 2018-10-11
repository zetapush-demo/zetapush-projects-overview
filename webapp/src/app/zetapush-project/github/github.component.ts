import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ZetapushProjectService, Github, DataStruct } from '../zetapush-project.service';
import { GithubPopupComponent } from './popup/github-popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	data: Github[];

	is_dialog_open = false;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(popup_data, repo_name: string, message: string) {
		var dialog_ref;

		popup_data.message = message;
		popup_data.repo_name = repo_name;
		if (!this.is_dialog_open) {
			dialog_ref = this.dialog.open(GithubPopupComponent, {
				width: '500px',
				data: popup_data
			});
			this.is_dialog_open = true;
			dialog_ref.afterClosed().subscribe(() => this.is_dialog_open = false);
		}
	}
	popup_on_new_data(delay: number) {
		const now = new Date().valueOf();
		const gap = now - delay;

		function get_last_data(tab: any[]) {
			if (!tab || !tab.length)
				return null;
			const last_timestamp = Math.max(...tab.map(x => x.timestamp));

			return tab.find(x => x.timestamp === last_timestamp && x.timestamp > gap);
		}
		for (var i = 0; this.data && i < this.data.length; i++) {
			const concat_data = this.data[i].issues.concat(this.data[i].pull_request);
			const popup_data = get_last_data(concat_data);

			if (popup_data)
				return this.openDialog(popup_data, this.data[i].name, popup_data.base ? 'New Pull request !!' : 'New Issue !!');
		}
	}

	on_get_data(tmp: Github[]) {
		if (!tmp)
			return;
		this.data = tmp;
		console.log(this.data);
		this.popup_on_new_data(1000 * 60 * 60 * 24 * 7 * 1); // 1 week
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp['github']);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

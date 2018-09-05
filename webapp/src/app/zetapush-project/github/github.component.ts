import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';

import { Github, ZetapushProjectService, DataStruct } from '../zetapush-project.service';
import { GithubPopupComponent } from './popup/github-popup.component';

interface FilterForm {
	selected: string;
	available_list: string[];
	placeholder: string;
};

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	data: Github[];
	data_save: Github[];

	repo_index: FormControl = new FormControl(0);

	form_field = [
		{
			field: 'assignees',
			subfield: 'login',
			placeholder: 'Assignee'
		},
		{
			field: 'labels',
			subfield: 'name',
			placeholder: 'Label'
		},
	];
	filter_form: FilterForm[][] = [];
	is_dialog_open: boolean = false;

	constructor(
		private zetapush_service: ZetapushProjectService,
		private dialog: MatDialog
	) { }

	openDialog(popup_data, message) {
		var dialog_ref;

		popup_data.message = message;
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
		var popup_data;

		function get_last_data(tab) {
			if (!tab)
				return null;
			for (var i = 0; i < tab.length; i++) {
				const gap = now - delay;

				if (new Date(tab[i].created).valueOf() > gap)
					return tab[i];
			}
			return null;
		}
		for (var i = 0; i < this.data.length; i++) {
			popup_data = get_last_data(this.data[i].issues);
			if (popup_data)
				return this.openDialog(popup_data, 'New Issue !!');
			popup_data = get_last_data(this.data[i].pull_request);
			if (popup_data)
				return this.openDialog(popup_data, 'New Pull request !!');
		}
	}

	filter_data_by(index, value, field, subfield) {
		this.data[index] = JSON.parse(JSON.stringify(this.data_save[index]));
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
		this.data[index].issues = this.data[index].issues.filter(foo);
		this.data[index].pull_request = this.data[index].pull_request.filter(foo);
	}

	get_list(data, field, subfield) {
		if (!data)
			return null;
		function filter(tmp) {
			return tmp.filter(x => x[field].length).map(x => x[field].map(y => y[subfield])).join().split(',').filter((x, y, z) => z.indexOf(x) === y);
		}
		return filter(data.issues).concat(filter(data.pull_request)).filter((x, y, z) => z.indexOf(x) === y);
	}

	on_get_data(tmp: Github[]) {
		if (!tmp)
			return;
		this.data = tmp;
		this.data_save = JSON.parse(JSON.stringify(this.data));
		for (var i = 0; i < this.data.length; i++) {
			this.filter_form[i] = [];
			for (var j = 0; j < this.form_field.length; j++) {
				this.filter_form[i].push({
					selected: '',
					available_list: this.get_list(
						this.data[i],
						this.form_field[j].field,
						this.form_field[j].subfield
					),
					placeholder: this.form_field[j].placeholder
				});
				this.filter_data_by(
					i,
					this.filter_form[i][j].selected,
					this.form_field[j].field,
					this.form_field[j].subfield,
				);
			}
		}
		console.log(this.data);
		console.log(this.filter_form);
		this.popup_on_new_data(1000 * 60 * 60 * 24 * 7 * 1); // 1 week
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();
		this.on_get_data(tmp['github']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

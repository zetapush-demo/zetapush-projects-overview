import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';

import { ZetapushProjectService, Github, DataStruct, FilterForm } from '../zetapush-project.service';
import { GithubPopupComponent } from './popup/github-popup.component';

@Component({
	selector: 'app-github',
	templateUrl: './github.component.html',
	styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

	data: Github[];
	data_save: Github[];

	repo_index: FormControl = new FormControl(0);

	form_field_name = {
		field: ['assignees', 'labels', 'user'],
		subfield: ['login', 'name', 'name'],
		placeholder: ['Assignee', 'Label', 'User']
	};
	filter_form: FilterForm[][] = [];
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
		var now = new Date().valueOf();
		const gap = now - delay;

		function get_last_data(tab: any[]) {
			if (!tab || !tab.length)
				return null;
			const last_timestamp = Math.max(...tab.map(x => new Date(x.created).valueOf()));

			return tab.find(x => {
				const current_timestamp = new Date(x.created).valueOf();

				if (current_timestamp === last_timestamp && current_timestamp > gap)
					return x;
			});
		}
		for (var i = 0; i < this.data.length; i++) {
			const concat_data = this.data[i].issues.concat(this.data[i].pull_request);
			const popup_data = get_last_data(concat_data);

			if (popup_data)
				return this.openDialog(popup_data, this.data[i].name, popup_data.base ? 'New Pull request !!' : 'New Issue !!');
		}
	}

	filter_data_by(index: number, formvalue: FilterForm[]) {
		const field: string[] = this.form_field_name.field;
		const subfield: string[] = this.form_field_name.subfield;
		const value: string[] = formvalue.map(x => x.selected); // please trust me

		this.data[index] = JSON.parse(JSON.stringify(this.data_save[index]));
		if (value.length !== field.length || field.length !== subfield.length)
			return;
		if (field.includes(undefined) || subfield.includes(undefined) || value.every(x => !x))
			return;
		function foo(elem) {
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
		this.data[index].issues = this.data[index].issues.filter(foo);
		this.data[index].pull_request = this.data[index].pull_request.filter(foo);
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

	on_get_data(tmp: Github[]) {
		if (!tmp)
			return;
		this.data = tmp;
		this.data_save = JSON.parse(JSON.stringify(this.data));
		for (var i = 0; i < this.data.length; i++) {
			this.filter_form[i] = [];
			for (var j = 0; j < this.form_field_name.field.length; j++) {
				this.filter_form[i].push({
					selected: '',
					available_list: this.get_list(
						this.data[i],
						this.form_field_name.field[j],
						this.form_field_name.subfield[j]
					),
					placeholder: this.form_field_name.placeholder[j]
				});
			}
		}
		console.log(this.data);
		this.popup_on_new_data(1000 * 60 * 60 * 24 * 7 * 1); // 1 week
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp['github']);
		this.zetapush_service.get_data().subscribe(
			(data: DataStruct) => this.on_get_data(data.github)
		);
	}
}

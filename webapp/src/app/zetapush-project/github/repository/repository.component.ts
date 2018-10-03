import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

import { Github, FilterForm } from '../../zetapush-project.service';

@Component({
	selector: 'app-repository',
	templateUrl: './repository.component.html',
	styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

	@Input() data: Github;

	data_save: Github;

	length: number;
	pageSize: number;

	form_field_name = {
		field: ['assignees', 'labels', 'user'],
		subfield: ['login', 'name', 'name'],
		placeholder: ['Assignee', 'Label', 'User']
	};
	filter_form: FilterForm[];

	constructor() { }

	paginator_branches(pageEvent: PageEvent) {
		this.filter_form.forEach(x => x.selected = '');
		this.data.issues = JSON.parse(JSON.stringify(this.data_save.issues));
		this.data.pull_request = JSON.parse(JSON.stringify(this.data_save.pull_request));
		this.data.issues = this.data.issues.filter((branch, index) => {
			if (index > (pageEvent.pageIndex * pageEvent.pageSize - 1) && index < (pageEvent.pageIndex * pageEvent.pageSize + pageEvent.pageSize))
				return branch;
		});
		this.data.pull_request = this.data.pull_request.filter((branch, index) => {
			if (index > (pageEvent.pageIndex * pageEvent.pageSize - 1) && index < (pageEvent.pageIndex * pageEvent.pageSize + pageEvent.pageSize))
				return branch;
		});
	}

	filter_data_by(formvalue: FilterForm[]) {
		const field: string[] = this.form_field_name.field;
		const subfield: string[] = this.form_field_name.subfield;
		const value: string[] = formvalue.map(x => x.selected); // please trust me

		this.data = JSON.parse(JSON.stringify(this.data_save));
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
		this.data.issues = this.data.issues.filter(foo);
		this.data.pull_request = this.data.pull_request.filter(foo);
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

	init_paginator() {
		this.length = Math.max(this.data.issues.length, this.data.pull_request.length);
		this.pageSize = 5;
		this.paginator_branches({
			pageIndex: 0,
			length: this.length,
			pageSize: 5,
		});
	}

	ngOnInit() {
		this.data_save = JSON.parse(JSON.stringify(this.data));
		this.init_form();
		this.init_paginator();
	}
}

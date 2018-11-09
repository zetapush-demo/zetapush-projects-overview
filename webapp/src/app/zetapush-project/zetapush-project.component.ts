import { Component, OnInit } from '@angular/core';
import { ZetapushProjectService, DataStruct } from './zetapush-project.service';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.scss']
})
export class ZetapushProjectComponent implements OnInit {

	data: DataStruct[];

	constructor(
		private zetapush_service: ZetapushProjectService,
	) { }

	on_get_data(tmp: DataStruct[]) {
		if (tmp && tmp.length) {
			this.data = tmp;
			console.log(this.data);
		}
	}

	async ngOnInit() {
		const tmp = await this.zetapush_service.get_last_data() as DataStruct[];

		this.on_get_data(tmp);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct[]) => this.on_get_data(data)
		);
	}
}
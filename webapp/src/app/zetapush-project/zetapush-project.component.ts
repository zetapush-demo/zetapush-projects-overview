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
		if (!tmp)
			return;
		this.data = tmp;
		console.log(this.data);
	}

	async ngOnInit() {
		const tmp: any = await this.zetapush_service.get_last_data();

		if (!tmp)
			return;
		this.on_get_data(tmp);
		this.zetapush_service.observer.subscribe(
			(data: DataStruct[]) => this.on_get_data(data)
		);
	}
}
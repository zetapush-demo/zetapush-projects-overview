import { Component, OnInit } from '@angular/core';

import { ZetapushProjectService } from './zetapush-project.service';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.scss']
})
export class ZetapushProjectComponent implements OnInit {

	ready = false;

	constructor(
		private zetapush_service: ZetapushProjectService
	) { }

	async ngOnInit() {
		await this.zetapush_service.connect();
		await this.zetapush_service.listen();
		this.ready = true;
	}
}
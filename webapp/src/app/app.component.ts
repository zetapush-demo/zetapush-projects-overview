import { Component, OnInit } from '@angular/core';

import { ZetapushProjectService } from './zetapush-project/zetapush-project.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

	constructor(
		private zetapush_service: ZetapushProjectService
	) { }

	ready = false;
	title = 'Zetapush Projects Overview';

	async ngOnInit() {
		await this.zetapush_service.connect();
		await this.zetapush_service.listen();
		this.ready = true;
	}
}

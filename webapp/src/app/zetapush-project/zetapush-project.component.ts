import { Component, OnInit } from '@angular/core';

import { ZetapushProjectService } from './zetapush-project.service';

@Component({
	selector: 'app-zetapush-project',
	templateUrl: './zetapush-project.component.html',
	styleUrls: ['./zetapush-project.component.css']
})
export class ZetapushProjectComponent implements OnInit {

	navlinks = ['github', 'jenkins', 'jira'];

	constuctor(
		private zetapush_service: ZetapushProjectService
	) {}

	async ngOnInit() {
		this.zetapush_service.init_observable();
		await this.zetapush_service.connect();
		await this.zetapush_service.listen();
	}
}

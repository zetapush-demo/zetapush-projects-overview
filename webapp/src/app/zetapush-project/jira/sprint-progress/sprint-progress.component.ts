import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-sprint-progress',
	templateUrl: './sprint-progress.component.html',
	styleUrls: ['./sprint-progress.component.css']
})
export class SprintProgressComponent {

	@Input() time;

	constructor() { }
}

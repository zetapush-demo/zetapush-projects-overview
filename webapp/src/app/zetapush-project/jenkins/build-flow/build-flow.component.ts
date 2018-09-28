import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-build-flow',
	templateUrl: './build-flow.component.html',
	styleUrls: ['./build-flow.component.css']
})
export class BuildFlowComponent {

	@Input() flows;

	constructor() { }
}

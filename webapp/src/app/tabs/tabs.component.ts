import { Component } from '@angular/core';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

	tabs = [
		{
			name: 'zetapush-project'
		},
		{
			name: 'monitoring'
		},
		{
			name: 'resume'
		}
	]
}

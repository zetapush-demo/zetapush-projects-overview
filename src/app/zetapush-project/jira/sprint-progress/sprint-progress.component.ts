import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-sprint-progress',
	templateUrl: './sprint-progress.component.html',
	styleUrls: ['./sprint-progress.component.css']
})
export class SprintProgressComponent implements OnInit {

	@Input() time;
	tmp: any = {};

	constructor() {}

	format_hour(hour: number): string {
		if (typeof hour !== 'number')
			return hour;
		if (hour > 8)
			return `${Math.round(hour / 8)}d ${hour % 8}h`;
		else if (hour < 0)
			return 'Finished';
		else
			return `${hour}h`;
	}

	compute_early_time(time): string {
		if (time.estimate - time.spent < time.remaining)
			return this.format_hour(time.spent - time.remaining);
	}

	compute_late_time(time): string {
		if (time.remaining > 0 && time.estimate - time.spent > time.remaining)
			return this.format_hour(time.spent - time.remaining);
		else if (time.remaining < 0)
			return `${Math.round(-time.remaining / 24)}d ${-time.remaining % 24}h`;
	}

	compute_progress_bar_data(time) {
		return {
			value: time.spent / time.estimate * 100,
			bufferValue: time.remaining > 0 ? 100 - time.remaining / time.estimate * 100 : 100
		};
	}

	format_time_details(details) {
		var tmp = [];

		details.forEach(x => {
			tmp.push({
				name: x.name,
				url: x.url,
				spent: this.format_hour(x.spent),
				estimate: this.format_hour(x.estimate)
			});
		});
		return tmp;
	}

	init_pie(details) {
		const field = ['spent', 'estimate'];
		var pies = [];

		function build_pie(field: string) {
			return {
				labels: details.map(x => x.name),
				datasets: [{
					label: `${field} time`,
					data: details.map(x => x[field]),
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(255, 159, 64)',
						'rgb(255, 205, 86)',
						'rgb(75, 192, 192)',
						'rgb(54, 162, 235)',
						'rgb(153, 102, 255)',
						'rgb(201, 203, 207)',
					],
				}],
			};
		};

		for (var i = 0; i < field.length; i++) {
			if (details.every(x => x[field[i]] === 0))
				continue;
			pies.push({
				pie: build_pie(field[i]),
				option: {
					title: {
						display: true,
						text: `${field[i]} time`
					}
				}
			});
		}
		return pies;
	}

	ngOnInit() {
		var tmp: any = {};

		if (this.time) {
			tmp.progress_bar = this.compute_progress_bar_data(this.time);
			tmp.early = this.compute_early_time(this.time);
			tmp.late = this.compute_late_time(this.time);
			tmp.spent = this.format_hour(this.time.spent);
			tmp.remaining = this.format_hour(this.time.remaining);
			tmp.estimate = this.format_hour(this.time.estimate);
			tmp.details = this.format_time_details(this.time.details);
			tmp.pies = this.init_pie(this.time.details);
			this.tmp = tmp;
		}
	}
}

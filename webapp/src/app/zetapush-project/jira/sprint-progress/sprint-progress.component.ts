import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-sprint-progress',
	templateUrl: './sprint-progress.component.html',
	styleUrls: ['./sprint-progress.component.css']
})
export class SprintProgressComponent implements OnInit {

	@Input() time;

	format_hour(hour: number): string {
		if (typeof hour === 'undefined')
			return;
		if (hour > 8)
			return `${Math.round(hour / 8)}d ${hour % 8}h`;
		else if (hour < 0)
			return 'Finished';
		else
			return `${hour}h`;
	}

	compute_early_time(time): number {
		if (time.estimate - time.spent < time.remaining)
			return time.spent - time.remaining;
	}

	compute_late_time(time): number {
		if (time.remaining > 0 && time.estimate - time.spent > time.remaining)
			return time.spent - time.remaining;
		else if (time.remaining < 0)
			return -time.remaining + time.estimate - time.spent;
	}

	compute_progress_bar_data(time) {
		return {
			value: time.spent / time.estimate * 100,
			bufferValue: time.remaining > 0 ? 100 - time.remaining / time.estimate * 100 : 100
		};
	}

	ngOnInit() {
		if (this.time) {
			this.time.progress_bar = this.compute_progress_bar_data(this.time);
			this.time.early = this.format_hour(this.compute_early_time(this.time));
			this.time.late = this.format_hour(this.compute_late_time(this.time));
			this.time.spent = this.format_hour(this.time.spent);
			this.time.remaining = this.format_hour(this.time.remaining);
			this.time.estimate = this.format_hour(this.time.estimate);
		}
	}
}

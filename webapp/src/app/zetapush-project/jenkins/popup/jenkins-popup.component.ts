import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'jenkins-popup',
	templateUrl: './jenkins-popup.component.html',
	styleUrls: ['./jenkins-popup.component.css']
})
export class JenkinsPopupComponent {

	constructor(
		public dialogRef: MatDialogRef<JenkinsPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	mute() {
		const ignore: string[] = JSON.parse(localStorage.getItem('jenkins_ignore')) || [];

		if (!ignore.includes(this.data.project)) {
			ignore.push(this.data.project);
			localStorage.setItem('jenkins_ignore', JSON.stringify(ignore));
		}
	}

	closeDialog() {
		this.dialogRef.close();
	}
}

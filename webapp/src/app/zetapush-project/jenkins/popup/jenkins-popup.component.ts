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
		@Inject(MAT_DIALOG_DATA) public data: object
	) { }

	closeDialog() {
		this.dialogRef.close();
	}
}

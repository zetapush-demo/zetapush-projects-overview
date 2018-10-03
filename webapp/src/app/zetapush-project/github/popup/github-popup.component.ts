import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'github-popup',
	templateUrl: './github-popup.component.html',
	styleUrls: ['./github-popup.component.css']
})
export class GithubPopupComponent {

	constructor(
		public dialogRef: MatDialogRef<GithubPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	closeDialog() {
		this.dialogRef.close();
	}
}

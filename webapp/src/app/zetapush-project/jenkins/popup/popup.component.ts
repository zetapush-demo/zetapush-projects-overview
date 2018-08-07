import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.css']
})
export class PopupComponent {

	constructor(
		public dialogRef: MatDialogRef<PopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: object
	) { }

	closeDialog() {
		this.dialogRef.close();
	}
}

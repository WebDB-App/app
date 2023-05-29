import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../shared/request.service";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../../environments/environment";
import { Licence } from "../../../classes/licence";

@Component({
	templateUrl: './subscription-dialog.component.html',
	styleUrls: ['./subscription-dialog.component.scss']
})
export class SubscriptionDialog implements OnInit {

	email = new FormControl('', [Validators.required, Validators.email]);
	licence?: Licence;
	env = environment

	constructor(
		private _snackBar: MatSnackBar,
		private request: RequestService
	) {
	}

	async ngOnInit() {
		this.licence = await Licence.get(this.request);
	}

	async save(email: string) {
		try {
			await this.request.post('subscription/save', {email});
			this._snackBar.open(`You successfully register this account. Thanks you =)`, "╳", {duration: 3000});
			await this.ngOnInit();
		} catch (err: any) {
			this._snackBar.open("Error : " + err.statusText + ". You can contact us at: main.webdb@gmail.com", "╳", {panelClass: 'snack-error'});
		}
	}
}

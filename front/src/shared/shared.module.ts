import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from "./round.pipe";

@NgModule({
	declarations: [
		RoundPipe
	],
	exports: [
		RoundPipe
	],
	imports: [
		CommonModule
	]
})
export class SharedModule {
}

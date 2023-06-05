import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from "./round.pipe";
import { BooleanPipe } from "./boolean.pipe";

@NgModule({
	declarations: [
		RoundPipe,
		BooleanPipe
	],
	exports: [
		RoundPipe,
		BooleanPipe
	],
	imports: [
		CommonModule
	]
})
export class SharedModule {
}

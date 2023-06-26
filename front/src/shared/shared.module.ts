import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from "./round.pipe";
import { BooleanPipe } from "./boolean.pipe";
import { CellComponent } from './cell/cell.component';
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { RouterLinkWithHref } from "@angular/router";

@NgModule({
	declarations: [
		RoundPipe,
		BooleanPipe,
  CellComponent
	],
	exports: [
		RoundPipe,
		BooleanPipe,
		CellComponent
	],
	imports: [
		CommonModule,
		NgxJsonViewerModule,
		RouterLinkWithHref
	]
})
export class SharedModule {
}

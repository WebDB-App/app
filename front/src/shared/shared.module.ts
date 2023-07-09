import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from "./round.pipe";
import { BooleanPipe } from "./boolean.pipe";
import { CellComponent } from './cell/cell.component';
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { RouterLinkWithHref } from "@angular/router";
import { IsSQLPipe } from "./is_sql.pipe";

@NgModule({
	declarations: [
		RoundPipe,
		BooleanPipe,
		CellComponent,
		IsSQLPipe
	],
	exports: [
		RoundPipe,
		BooleanPipe,
		CellComponent,
		IsSQLPipe
	],
	imports: [
		CommonModule,
		NgxJsonViewerModule,
		RouterLinkWithHref
	]
})
export class SharedModule {
}

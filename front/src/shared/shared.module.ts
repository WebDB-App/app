import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from "./round.pipe";
import { BooleanPipe } from "./boolean.pipe";
import { CellComponent } from './cell/cell.component';
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { RouterLinkWithHref } from "@angular/router";
import { UpdateDataDialogComponent } from './update-data-dialog/update-data-dialog.component';
import { FlexModule } from "@angular/flex-layout";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [
		RoundPipe,
		BooleanPipe,
		CellComponent,
		UpdateDataDialogComponent
	],
	exports: [
		RoundPipe,
		BooleanPipe,
		CellComponent,
	],
	imports: [
		CommonModule,
		NgxJsonViewerModule,
		RouterLinkWithHref,
		FlexModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatOptionModule,
		MonacoEditorModule,
		ClipboardModule,
		FormsModule
	]
})
export class SharedModule {
}

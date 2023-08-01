import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from "./diagram/diagram.component";
import { AdvancedComponent, DropDatabaseDialog } from "./advanced/advanced.component";
import { RelationsComponent } from "./relations/relations.component";
import { LoadComponent } from "./load/load.component";
import { DumpComponent } from "./dump/dump.component";
import { FlexModule, GridModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { RightRoutingModule } from "./right-routing.module";
import { ColumnComponent } from "./column/column.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CreateTableComponent } from './create-table/create-table.component';
import { UpdateColumnComponent } from './update-column/update-column.component';
import { AddColumnComponent } from './add-column/add-column.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkColumnDef } from "@angular/cdk/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { AiComponent } from "./ai/ai.component";
import { MatCardModule } from "@angular/material/card";
import { SharedModule } from "../../shared/shared.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { HighlightModule } from 'ngx-highlightjs';
import { HistoryComponent, SortPipe } from "./history/history.component";
import { TypesComponent } from "./types/types.component";


@NgModule({
	declarations: [
		DiagramComponent,
		AdvancedComponent,
		RelationsComponent,
		LoadComponent,
		DumpComponent,
		ColumnComponent,
		DropDatabaseDialog,
		HistoryComponent,
		TypesComponent,
		SortPipe,
		CreateTableComponent,
		UpdateColumnComponent,
		AddColumnComponent,
		AiComponent
	],
	exports: [
		DiagramComponent,
		RelationsComponent,
		LoadComponent,
		DumpComponent,
		AdvancedComponent
	],
	imports: [
		CommonModule,
		MonacoEditorModule,
		FlexModule,
		RightRoutingModule,
		MatButtonModule,
		HighlightModule,
		MatInputModule,
		MatSelectModule,
		MatDividerModule,
		MatDialogModule,
		MatSlideToggleModule,
		MatToolbarModule,
		MatSliderModule,
		MatIconModule,
		FormsModule,
		MatTreeModule,
		MatCheckboxModule,
		MatButtonToggleModule,
		MatProgressBarModule,
		MatTableModule,
		GridModule,
		MatAutocompleteModule,
		ReactiveFormsModule,
		DragDropModule,
		MatTooltipModule,
		MatMenuModule,
		MatCardModule,
		SharedModule,
		MatExpansionModule,
		MatProgressSpinnerModule,
		ClipboardModule
	],
	providers: [
		CdkColumnDef,
	]
})
export class RightModule {
}

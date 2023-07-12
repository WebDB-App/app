import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from "@angular/flex-layout";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ExploreComponent } from './explore/explore.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { QueryComponent } from './query/query.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { DropTableDialog, TableAdvancedComponent, TruncateTableDialog } from "./advanced/advanced.component";
import { InsertComponent } from "./insert/insert.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AddIndexDialog, DropColumnDialog, StructureComponent, } from './structure/structure.component';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { CodeModule } from "../../shared/code/code.module";
import { MatMenuModule } from "@angular/material/menu";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TriggerComponent } from "./trigger/trigger.component";
import { SharedModule } from "../../shared/shared.module";
import { TablesComponent } from "./tables/tables.component";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HighlightModule } from "ngx-highlightjs";
import { OverlayModule } from "@angular/cdk/overlay";

@NgModule({
	declarations: [
		ExploreComponent,
		QueryComponent,
		TableAdvancedComponent,
		InsertComponent,
		AddIndexDialog,
		DropColumnDialog,
		DropTableDialog,
		TruncateTableDialog,
		StructureComponent,
		TriggerComponent,
		TablesComponent,
	],
	imports: [
		CommonModule,
		CoreRoutingModule,
		MatSidenavModule,
		MatFormFieldModule,
		MatSelectModule,
		MatRadioModule,
		MatListModule,
		MatIconModule,
		FlexModule,
		MatInputModule,
		MatButtonModule,
		MatToolbarModule,
		MatPaginatorModule,
		MatTableModule,
		MatSortModule,
		MatCheckboxModule,
		MatTooltipModule,
		MatTabsModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatSlideToggleModule,
		FormsModule,
		MatCardModule,
		MatChipsModule,
		MatExpansionModule,
		ClipboardModule,
		CodeModule,
		MonacoEditorModule,
		MatMenuModule,
		DragDropModule,
		SharedModule,
		NgxJsonViewerModule,
		MatAutocompleteModule,
		HighlightModule,
		OverlayModule
	]
})
export class CoreModule {
}

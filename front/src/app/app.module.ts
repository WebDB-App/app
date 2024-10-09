import { APP_INITIALIZER, EnvironmentProviders, ErrorHandler, NgModule, Provider } from "@angular/core";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular";
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { ContainerComponent } from './container/container.component';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ConnectionComponent, CreateDatabaseDialog, FirstVisitDialog } from "./connection/connection.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor-v2";
import { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatStepperModule } from "@angular/material/stepper";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { HighlightModule, provideHighlightOptions } from 'ngx-highlightjs';
import { Server } from "../classes/server";
import { MatTabsModule } from "@angular/material/tabs";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CreateTableDialog, TablesComponent } from "./tables/tables.component";
import { ConfigDialog } from "./top-right/config/config-dialog.component";
import { SharedModule } from "../shared/shared.module";
import { LogsDialog, TopRightComponent } from './top-right/top-right.component';
import { environment } from '../environments/environment';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EditConnectionComponent } from './connection/edit-connection/edit-connection.component';
import { MatTableModule } from "@angular/material/table";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { StatsDialogComponent } from "./stats/stats-dialog.component";
import { ProcessDialogComponent } from "./process/process-dialog.component";
import { MatChipsModule } from "@angular/material/chips";
import { EditQueryDialog, MigrateComponent } from './migrate/migrate.component';
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { CustomPaginatorIntl } from "../shared/paginator.transform";
import { VariableDialogComponent } from "./variable/variable-dialog.component";
import { CoreModule } from "./core/core.module";

let providers: Provider|EnvironmentProviders[] = [
	provideHighlightOptions({
		coreLibraryLoader: () => import('highlight.js/lib/core'),
		lineNumbersLoader: () => import('ngx-highlightjs/line-numbers')
	}),
	provideCharts(withDefaultRegisterables()),
	provideHttpClient(withInterceptorsFromDi()),
	{
		provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
		useValue: {
			subscriptSizing: 'dynamic',
			appearance: "outline"
		}
	}, {
		provide: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
		useValue: {
			hideSingleSelectionIndicator: true,
			hideMultipleSelectionIndicator: true,
		}
	}, {
		provide: MAT_DIALOG_DEFAULT_OPTIONS,
		useValue: {
			closeOnNavigation: false,
			hasBackdrop: false
		}
	}, {
		provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
		useValue: {
			duration: 3000
		}
	}, {
		provide: MatPaginatorIntl,
		useClass: CustomPaginatorIntl
	}
];
if (environment.production) {
	providers = providers.concat([
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: false,
			}),
		}, {
			provide: Sentry.TraceService,
			deps: [Router],
		},
		{
			provide: APP_INITIALIZER,
			useFactory: () => () => {
			},
			deps: [Sentry.TraceService],
			multi: true,
		}
	]);
}

declare var monaco: any;

export const monacoConfig: NgxMonacoEditorConfig = {
	baseUrl: window.location.origin + "/assets/monaco/min/vs",
	defaultOptions: {
		padding: {top: 10},
		minimap: {enabled: false},
		theme: 'vs-dark',
		automaticLayout: true,
		fixedOverflowWidgets: true,
		tabSize: 4
	}, onMonacoLoad: () => {
		monaco.languages.registerDocumentFormattingEditProvider('sql', {
			provideDocumentFormattingEdits(model: any, options: any) {
				return [
					{
						range: model.getFullModelRange(),
						text: Server.getSelected().driver.format(model.getValue())
					}
				];
			},
		});
		monaco.languages.registerCompletionItemProvider('sql', {
			triggerCharacters: [".", '"', "'", '`', '(', '{', '['],
			provideCompletionItems: (model: any, position: any) => {
				const textUntilPosition = model.getValueInRange({
					startLineNumber: 0,
					startColumn: 0,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				});
				const colUntilPosition = model.getValueInRange({
					startLineNumber: position.lineNumber,
					startColumn: 0,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				});
				const suggestions = Server.getSelected().driver.generateSuggestions!(textUntilPosition, colUntilPosition, model.getValue());
				return {
					suggestions: structuredClone(suggestions)
				};
			}
		});
	}
};

@NgModule({
	declarations: [
		AppComponent,
		ContainerComponent,
		ConnectionComponent,
		ConfigDialog,
		LogsDialog,
		CreateDatabaseDialog,
		FirstVisitDialog,
		TablesComponent,
		CreateTableDialog,
		TopRightComponent,
		EditConnectionComponent,
		StatsDialogComponent,
		ProcessDialogComponent,
		MigrateComponent,
		EditQueryDialog,
		VariableDialogComponent
	],
	bootstrap: [AppComponent],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		MonacoEditorModule.forRoot(monacoConfig),
		MatCardModule,
		HighlightModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatTooltipModule,
		MatMenuModule,
		MatIconModule,
		MatDividerModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatListModule,
		MatExpansionModule,
		MatProgressBarModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatSelectModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		FormsModule,
		MonacoEditorModule,
		MatButtonToggleModule,
		MatStepperModule,
		ClipboardModule,
		MatTabsModule,
		DragDropModule,
		SharedModule,
		MatCheckboxModule,
		MatTableModule,
		MatChipsModule,
		MatPaginatorModule,
		CoreModule,
		BaseChartDirective
	],
	providers
})
export class AppModule {
}

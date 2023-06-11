import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { ContainerComponent } from './container/container.component';
import { MatCardModule } from "@angular/material/card";
import { FlexModule } from "@angular/flex-layout";
import { CodeModule } from "../shared/code/code.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ConnectionDialog, CreateDatabaseDialog, ServersComponent } from "./container/servers/servers.component";
import { ConfigDialog } from "./container/config/config-dialog.component";
import { SubscriptionDialog } from "./container/subscription/subscription-dialog.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatStepperModule } from "@angular/material/stepper";
import { ClipboardModule } from "@angular/cdk/clipboard";
import {
	HighlightModule,
	HIGHLIGHT_OPTIONS,
	HighlightOptions,
} from 'ngx-highlightjs';

@NgModule({
	declarations: [
		AppComponent,
		ContainerComponent,
		ServersComponent,
		ConfigDialog,
		SubscriptionDialog,
		CreateDatabaseDialog,
		ConnectionDialog
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		MatCardModule,
		FlexModule,
		CodeModule,
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
		HttpClientModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		FormsModule,
		MonacoEditorModule,
		MatButtonToggleModule,
		MatStepperModule,
		ClipboardModule
	],
	providers: [
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: <HighlightOptions>{
				lineNumbers: true,
				// @ts-ignore
				lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
				fullLibraryLoader: () => import('highlight.js'),
			}
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

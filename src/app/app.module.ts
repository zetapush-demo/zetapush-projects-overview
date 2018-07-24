import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material';


import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { PopupComponent } from './zetapush-project/github/popup/popup.component';

import { ClientProjectComponent } from './client-project/client-project.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		BrowserAnimationsModule,
		MatExpansionModule,
		MatTabsModule,
		MatDialogModule
	],
	declarations: [
		AppComponent,
		ZetapushProjectComponent,
		GithubComponent,
		ClientProjectComponent,
		MainComponent,
		PopupComponent,
	],
	providers: [],
	entryComponents: [PopupComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}

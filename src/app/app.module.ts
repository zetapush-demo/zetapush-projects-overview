import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { ClientProjectComponent } from './client-project/client-project.component';
import { MainComponent } from './main/main.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		BrowserAnimationsModule,
		MatExpansionModule,
		MatTabsModule
	],
	declarations: [
		AppComponent,
		ZetapushProjectComponent,
		GithubComponent,
		ClientProjectComponent,
		MainComponent,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}

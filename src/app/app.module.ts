import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { ClientProjectComponent } from './client-project/client-project.component';
import { MainComponent } from './main/main.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		MarkdownModule.forRoot()
	],
	declarations: [
		AppComponent,
		ZetapushProjectComponent,
		ClientProjectComponent,
		MainComponent,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { ClientProjectComponent } from './client-project/client-project.component';
import { MainComponent } from './main/main.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
	BrowserModule,
	AppRoutingModule,
	HttpClientModule
    ],
    declarations: [
	AppComponent,
	ZetapushProjectComponent,
	ClientProjectComponent,
	MainComponent,
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}

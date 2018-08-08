import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatButtonModule} from '@angular/material';

import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ClientProjectComponent } from './client-project/client-project.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';
import { PopupComponent } from './zetapush-project/github/popup/popup.component';

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
		MatDialogModule,
		MatButtonModule,

	],
	declarations: [
		AppComponent,
		MainComponent,
		ClientProjectComponent,
		ZetapushProjectComponent,
		GithubComponent,
		JenkinsComponent,
		PopupComponent,
	],
	providers: [],
	entryComponents: [PopupComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}

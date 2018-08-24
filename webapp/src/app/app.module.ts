import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatButtonModule} from '@angular/material';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { GithubPopupComponent } from './zetapush-project/github/popup/github-popup.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';
import { JenkinsPopupComponent } from './zetapush-project/jenkins/popup/jenkins-popup.component';

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
		ZetapushProjectComponent,
		GithubComponent,
		GithubPopupComponent,
		JenkinsComponent,
		JenkinsPopupComponent,
	],
	providers: [],
	entryComponents: [GithubPopupComponent, JenkinsPopupComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}

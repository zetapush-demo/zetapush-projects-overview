import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule} from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CdkTableModule } from '@angular/cdk/table'

import { AppComponent } from './app.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { GithubPopupComponent } from './zetapush-project/github/popup/github-popup.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';
import { JenkinsPopupComponent } from './zetapush-project/jenkins/popup/jenkins-popup.component';
import { JiraComponent } from './zetapush-project/jira/jira.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		BrowserAnimationsModule,
		FlexLayoutModule,
		MatExpansionModule,
		MatTabsModule,
		MatDialogModule,
		MatButtonModule,
		MatSelectModule,
		MatCardModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatButtonModule,
		MatGridListModule,
		MatTableModule,
		MatTooltipModule,
		CdkTableModule,
		MatPaginatorModule
	],
	declarations: [
		AppComponent,
		MonitoringComponent,
		ZetapushProjectComponent,
		GithubComponent,
		GithubPopupComponent,
		JenkinsComponent,
		JenkinsPopupComponent,
		JiraComponent
	],
	providers: [],
	entryComponents: [
		GithubPopupComponent,
		JenkinsPopupComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {}

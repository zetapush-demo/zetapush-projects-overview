import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table'
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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ResumeComponent } from './resume/resume.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { RepositoryComponent } from './zetapush-project/github/repository/repository.component';
import { GithubPopupComponent } from './zetapush-project/github/popup/github-popup.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';
import { BuildFlowComponent } from './zetapush-project/jenkins/build-flow/build-flow.component';
import { JenkinsPopupComponent } from './zetapush-project/jenkins/popup/jenkins-popup.component';
import { JiraComponent } from './zetapush-project/jira/jira.component';
import { SprintProgressComponent } from './zetapush-project/jira/sprint-progress/sprint-progress.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		BrowserAnimationsModule,
		FlexLayoutModule,
		CdkTableModule,
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
		MatPaginatorModule
	],
	declarations: [
		AppComponent,
		MonitoringComponent,
		ResumeComponent,
		ZetapushProjectComponent,
		GithubComponent,
		RepositoryComponent,
		GithubPopupComponent,
		JenkinsComponent,
		BuildFlowComponent,
		JenkinsPopupComponent,
		JiraComponent,
		SprintProgressComponent,
		TabsComponent
	],
	providers: [],
	entryComponents: [
		GithubPopupComponent,
		JenkinsPopupComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {}

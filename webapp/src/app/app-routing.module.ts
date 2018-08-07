import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';

import { ClientProjectComponent } from './client-project/client-project.component';

const routes: Routes = [
	{ path: '', component: MainComponent},
	{ path: 'zetapush', component: ZetapushProjectComponent, children: [
		{ path: 'github', component: GithubComponent },
		{ path: 'jenkins', component: JenkinsComponent },
		// 	{ path: 'jira', component: JiraComponent }
		{ path: '**', redirectTo: '/zetapush'}
	]},
	{ path: 'client', component: ClientProjectComponent},
	{ path: '**', redirectTo: '/'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}

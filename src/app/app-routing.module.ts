import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';

import { ClientProjectComponent } from './client-project/client-project.component';

const routes: Routes = [
	{ path: '', component: MainComponent},
	{ path: 'zetapush', component: ZetapushProjectComponent, children: [
		{ path: 'github', component: GithubComponent }
		{ path: '**', redirectTo: '/zetapush'},
		// 	{ path: 'jenkins', component: JenkinsComponent },
		// 	{ path: 'jira', component: JiraComponent }
	]},
	{ path: 'client', component: ClientProjectComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MainComponent } from './main/main.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';

import { ClientProjectComponent } from './client-project/client-project.component';

@Injectable()
export class Resolver implements Resolve<any> {
	constructor(
		private zetapush: ZetapushProjectComponent
	) {}

	resolve() {
	}
}

const routes: Routes = [
	{ path: '', component: MainComponent},
	{ path: 'zetapush', component: ZetapushProjectComponent, resolve: {zetapush: Resolver },
		children: [
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
	exports: [RouterModule],
	providers: [{
		provide: Resolver,
		useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'zetapush'
	}]
})
export class AppRoutingModule {}

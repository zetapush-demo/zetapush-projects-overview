import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MainComponent } from './main/main.component';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';

import { ZetapushProjectService } from './zetapush-project/zetapush-project.service';

import { ClientProjectComponent } from './client-project/client-project.component';

@Injectable()
class Resolver implements Resolve<any> {
	constructor(
		private zetapush_service: ZetapushProjectService
	) {}

	async resolve() {
		this.zetapush_service.init_observable();
		await this.zetapush_service.connect();
		await this.zetapush_service.listen();
	}
}

const routes: Routes = [
	{ path: '', component: MainComponent},
	{ path: 'zetapush', component: ZetapushProjectComponent,
		resolve: {zetapush: Resolver },
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
	providers: [Resolver]
})
export class AppRoutingModule {}

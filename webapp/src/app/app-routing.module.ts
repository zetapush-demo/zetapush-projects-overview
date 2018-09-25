import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';

import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { GithubComponent } from './zetapush-project/github/github.component';
import { JenkinsComponent } from './zetapush-project/jenkins/jenkins.component';
import { JiraComponent } from './zetapush-project/jira/jira.component';

import { ZetapushProjectService } from './zetapush-project/zetapush-project.service';

@Injectable()
class Resolver implements Resolve<any> {
	constructor(
		private zetapush_service: ZetapushProjectService
	) {}

	async resolve() {
		await this.zetapush_service.connect();
		await this.zetapush_service.listen();
	}
}

const routes: Routes = [
	{ path: '', component: ZetapushProjectComponent,
		resolve: { zetapush: Resolver },
	},
	{ path: '**', redirectTo: '/' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [Resolver]
})
export class AppRoutingModule {}

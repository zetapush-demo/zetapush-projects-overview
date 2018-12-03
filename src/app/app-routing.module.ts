import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from './tabs/tabs.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ResumeComponent } from './resume/resume.component';

const routes: Routes = [
	{ path: '', component: TabsComponent },
	{ path: 'zetapush-project', component: ZetapushProjectComponent },
	{ path: 'monitoring', component: MonitoringComponent },
	{ path: 'resume', component: ResumeComponent },
	{ path: '**', redirectTo: '/' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule],
	providers: []
})
export class AppRoutingModule {}
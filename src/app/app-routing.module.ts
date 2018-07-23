import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MainComponent } from "./main/main.component";
import { ZetapushProjectComponent } from "./zetapush-project/zetapush-project.component";
import { ClientProjectComponent } from "./client-project/client-project.component";

const routes: Routes = [
	{ path: "", component: MainComponent },
	{ path: "zetapush", component: ZetapushProjectComponent },
	{ path: "client", component: ClientProjectComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZetapushProjectComponent } from './zetapush-project/zetapush-project.component';
import { ClientProjectComponent } from './client-project/client-project.component';

@NgModule({
  declarations: [
    AppComponent,
    ZetapushProjectComponent,
    ClientProjectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

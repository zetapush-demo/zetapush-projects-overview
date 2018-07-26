"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ngx_markdown_1 = require("ngx-markdown");
var animations_1 = require("@angular/platform-browser/animations");
var expansion_1 = require("@angular/material/expansion");
var tabs_1 = require("@angular/material/tabs");
var app_component_1 = require("./app.component");
var zetapush_project_component_1 = require("./zetapush-project/zetapush-project.component");
var github_component_1 = require("./zetapush-project/github/github.component");
var popup_component_1 = require("./zetapush-project/github/popup/popup.component");
var client_project_component_1 = require("./client-project/client-project.component");
var main_component_1 = require("./main/main.component");
var app_routing_module_1 = require("./app-routing.module");
var github_routing_module_1 = require("./github-routing.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                github_routing_module_1.GithubRoutingModule,
                http_1.HttpClientModule,
                ngx_markdown_1.MarkdownModule.forRoot(),
                animations_1.BrowserAnimationsModule,
                expansion_1.MatExpansionModule,
                tabs_1.MatTabsModule
            ],
            declarations: [
                app_component_1.AppComponent,
                zetapush_project_component_1.ZetapushProjectComponent,
                github_component_1.GithubComponent,
                popup_component_1.PopupComponent,
                client_project_component_1.ClientProjectComponent,
                main_component_1.MainComponent,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
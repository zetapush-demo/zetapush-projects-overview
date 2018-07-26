"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngx_markdown_1 = require("ngx-markdown");
var zetapush_project_service_1 = require("../zetapush-project.service");
var GithubComponent = /** @class */ (function () {
    function GithubComponent(zetapush_service, md) {
        this.zetapush_service = zetapush_service;
        this.md = md;
        this.github_url = 'http://127.0.0.1:1880/github';
        this.gap_refresh = 900000;
    }
    GithubComponent.prototype.check_new_data = function (tab) {
        var now = new Date().valueOf();
        for (var i = 0; i < tab.length; i++) {
            var gap = new Date(tab[i].created).valueOf() - now;
            if (-gap < this.gap_refresh)
                return (i);
        }
        return (-1);
    };
    GithubComponent.prototype.on_get_data = function (tmp) {
        this.github_data = {
            release: tmp['release'],
            repo: tmp['repo'],
            issues: tmp['issues'],
            pull_request: tmp['pull_request']
        };
        this.last_issues = this.check_new_data(this.github_data.issues);
        this.last_pull_request = this.check_new_data(this.github_data.pull_request);
        if (this.last_issues !== -1)
            console.log(this.github_data.issues[this.last_issues]);
        if (this.last_pull_request !== -1)
            console.log(this.github_data.pull_request[this.last_pull_request]);
    };
    GithubComponent.prototype.get_github_data = function () {
        var _this = this;
        this.zetapush_service.get_github_data(this.github_url).subscribe(function (tmp) { return _this.on_get_data(tmp); });
    };
    GithubComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_github_data();
        setInterval(function () {
            _this.get_github_data();
        }, this.gap_refresh);
    };
    GithubComponent = __decorate([
        core_1.Component({
            selector: 'app-github',
            templateUrl: './github.component.html',
            styleUrls: ['./github.component.css']
        }),
        __metadata("design:paramtypes", [zetapush_project_service_1.ZetapushProjectService, ngx_markdown_1.MarkdownService])
    ], GithubComponent);
    return GithubComponent;
}());
exports.GithubComponent = GithubComponent;
//# sourceMappingURL=github.component.js.map
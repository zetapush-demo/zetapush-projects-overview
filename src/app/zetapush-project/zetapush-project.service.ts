import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface GithubDataStruct {
	release: string;
	repo: string;
	issues: object[];
	pull_request: object[];
}

@Injectable({
	providedIn: 'root'
})
export class ZetapushProjectService {
	constructor(private http: HttpClient) {}

	get_data(url: string) {
		return this.http.get(url);
	}
}

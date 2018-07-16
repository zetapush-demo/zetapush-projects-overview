import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';

export interface data_struct {
	release: string;
	repo: string;
	issues: object[];
}

@Injectable()
export class ZetapushProjectService {

	constructor(private http: HttpClient) { }

	get_data(url: string) {
		return this.http.get(url);
	};
}

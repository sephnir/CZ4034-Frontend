import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({ providedIn: "root" })
export class APIservice {
	constructor(private http: HttpClient) {}

	// Uses http.get() to load data from a single API endpoint
	getApps(url: string) {
		return this.http.get(url); 
	}
}

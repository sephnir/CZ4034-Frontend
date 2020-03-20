import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SpellCheckerService } from 'ngx-spellchecker';


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

@Injectable({ providedIn: "root" })
export class APIspellcheck {
	fileURL = "https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic"
	dictionary: any
	constructor(private spellCheckerService: SpellCheckerService, private httpClient: HttpClient) {}
	
	r(){
		this.httpClient.get(this.fileURL, { responseType: 'text' }).subscribe((res: any) => {
      	 this.dictionary = this.spellCheckerService.getDictionary(res);
		},err => console.error(err))
		
	return this.dictionary;
	}
	getdict(){
		return this.r();
	}


}

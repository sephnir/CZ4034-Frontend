import { Component, OnInit } from "@angular/core";
import { appresult } from "./result.app.model";
import { Router, NavigationExtras } from "@angular/router";
import { APIservice } from "../api.service";

@Component({
	selector: "app-resultpage",
	templateUrl: "./resultpage.component.html",
	styleUrls: ["./resultpage.component.scss"]
})
export class ResultpageComponent implements OnInit {
	private readonly reviewUrl =
		"http://18.141.144.113:8983/solr/appreviews/query?q=";
	private readonly appUrl = "http://18.141.144.113:8983/solr/apps/query?q=";
	search: string;
	jsonList: any;
	resultList: appresult[] = [];
	sortingmethods: string[];
	sortingselected: string;
	suggestionExist: boolean;
	suggestion: string;
	category: string;
	currentpage: number;
	pagenum: number;
	pageRange: number[];

	constructor(private router: Router, private _api: APIservice) {
		this.search = <string>history.state.data;
		this.category = <string>history.state.category;
		this.currentpage = <number>history.state.currentpage;
		this.sortingmethods = ["Relevance", "Alphabetical", "Score"];
		this.sortingselected = this.sortingmethods[0];
		this.suggestionExist = false;
		this.pagenum;
		this.fetch();
	}

	sortArray() {
		switch (
			this.sortingselected
			//case "Score": this.sortScore(); break;
			//case "Alphabetical": this.sortAlphabet(); break;
		) {
		}
	}

	/*
	sortScore(){
		this.resultList.sort(function(a:appresult, b:appresult){
			if(a.score > b.score) return 1;
			if(a.score < b.score) return -1;
			return 0;
		});
	}*/

	// sortAlphabet(){
	// 	this.resultList.sort(function(a:appresult, b:appresult){
	// 		if(a.name > b.name) return 1;
	// 		if(a.name < b.name) return -1;
	// 		return 0;
	// 	});
	// }

	correctlyspelled() {
		this.suggestionExist = !this.jsonList.spellcheck.correctlySpelled;
		this.suggestion = this.jsonList.spellcheck.suggestions[1].suggestion[0].word;
	}

	/**
	 * Fetch data from backend
	 */
	fetch() {
		let urlStr = "";
		switch (this.category) {
			case "Apps":
				urlStr = this.appUrl + this.search;
				break;
			case "Reviews":
				urlStr = this.reviewUrl + this.search+`&group=true&group.field=appId&group.limit=1`;
				break;
			case "All":
				break;
		}
		let nextrow = this.currentpage * 10;
		let previousrow = nextrow - 10;
		urlStr += `&rows=${nextrow}&start=${previousrow}`;
		console.log(urlStr);
		this._api.getApps(urlStr).subscribe(
			data => {
				this.jsonList = data;
				this.amountofpages();
				this.responseStrip();
			},
			err => console.error(err),
			() => {
				console.log(urlStr);
				this.update();
				//this.correctlyspelled()
			}
		);
		//
	}

	responseStrip() {
		switch(this.category){
			case 'Apps':
				this.jsonList = this.jsonList.response.docs;
				break;
			case 'Reviews':
				if(this.jsonList.grouped.appId.groups) 
					this.jsonList = this.jsonList.grouped.appId.groups;
				console.log(this.jsonList);
				break;
			case 'All':
				break;
		}
	}

	amountofpages() {
		if(this.category == 'Apps'){
			this.pagenum = Math.floor(this.jsonList.response.numFound / 10);
		

		let remainder = <number>this.pagenum % 10;
		if (remainder > 0) {
			this.pagenum += 1;
		}
		console.log(this.pagenum);
		this.pageRange = Array.from(Array(this.pagenum).keys()).map(i => i + 1);}
		else if (this.category == "Reviews"){
			this.pageRange = Array.from(Array(1).keys()).map(i => i + 1);
			// let length = this.jsonList.grouped.appId.groups[0].length
			// this.pagenum = Math.floor(length / 10);
		}
}

	changePage(page) {
		this.redirectTo(["/resultpage"], {
			state: {
				data: this.search,
				category: this.category,
				currentpage: page
			}
		});
	}

	redirectTo(uri: string[], data: NavigationExtras) {
		this.router
			.navigateByUrl("/", { skipLocationChange: true })
			.then(() => this.router.navigate(uri, data));
	}

	/**
	 * Update fetched data
	 */
	update() {
		console.log("JSON" + <JSON>this.jsonList);
		this.resultList = [];
		if (this.category == 'Apps'){
			let length = Object.keys(this.jsonList);
			
			for (let entry of length) {
				let current = this.jsonList[entry];
				this.resultList.push(
				new appresult(
						current.id,
						current.icon[0],
						current.title,
						current.description,
						current.genre,
						current.scoreText,
						current.appId
					)
				);
			}
		}
		else if (this.category == "Reviews"){
			let length = this.jsonList.length;
			for (let i=0; i<length; i++) {
				let current = this.jsonList[i].doclist.docs[0];
			this.resultList.push(
				new appresult(
					'',
					current.appImage,
					current.appName,
					'',
					'',
					'',
					current.appId
					)
				);
			}
		}
				
		console.log(this.resultList);
	}

	ngOnInit() {}
}

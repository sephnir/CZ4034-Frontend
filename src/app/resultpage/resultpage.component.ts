import { Component, OnInit } from "@angular/core";
import { appresult } from "./result.app.model";
import { APIservice } from "../api.service";

@Component({
	selector: "app-resultpage",
	templateUrl: "./resultpage.component.html",
	styleUrls: ["./resultpage.component.scss"]
})
export class ResultpageComponent implements OnInit {
	private readonly url = "http://www.mocky.io/v2/5e44e565300000393061469e";
	search: string;
	jsonList: JSON;
	resultList: appresult[] = [];
	sortingmethods:string[];
	sortingselected: string;


	constructor(private _api: APIservice) {
		this.search = <string>history.state.data;
		this.sortingmethods = ["Relevance","Alphabetical","Score"]
		this.sortingselected = this.sortingmethods[0];
		this.fetch();
	}

	sortArray(){
		switch(this.sortingselected){
			case "Score": this.sortScore(); break;
			case "Alphabetical": this.sortAlphabet(); break;
		}
	}

	sortScore(){
		this.resultList.sort(function(a:appresult, b:appresult){
			if(a.score > b.score) return 1;
			if(a.score < b.score) return -1;
			return 0;
		});
	}

	sortAlphabet(){
		this.resultList.sort(function(a:appresult, b:appresult){
			if(a.name > b.name) return 1;
			if(a.name < b.name) return -1;
			return 0;
		});
	}

	/**
	 * Fetch data from backend
	 */
	fetch() {
		this._api.getApps(this.url).subscribe(
			data => (this.jsonList = <JSON>data),
			err => console.error(err),
			() => this.update()
		);
	}

	/**
	 * Update fetched data
	 */
	update() {
		let length = Object.keys(this.jsonList);

		this.resultList = [];
		for (let entry of length) {
			let current = this.jsonList[entry];
			this.resultList.push(
				new appresult(current.id, current.title , current.icon,current.size)
			);
		}

		console.log(this.resultList);
		console.log("TEST");
	}

	ngOnInit() {}
}

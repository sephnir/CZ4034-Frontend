import { Component, OnInit } from "@angular/core";
import { appresult } from "./result.app.model";
import { Router, NavigationExtras } from "@angular/router";
import { APIservice, searchbarhistory } from "../api.service";

@Component({
	selector: "app-resultpage",
	templateUrl: "./resultpage.component.html",
	styleUrls: ["./resultpage.component.scss"],
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

	constructor(
		private router: Router,
		private _api: APIservice,
		private _search: searchbarhistory
	) {
		this.currentpage = <number>history.state.currentpage;
		this.sortingmethods = ["Relevance", "Alphabetical", "Score"];
		this.sortingselected = this.sortingmethods[0];
		this.suggestionExist = false;
		this.pagenum;
	}

	sortArray() {
		switch (
			this.sortingselected
			//case "Score": this.sortScore(); break;
			//case "Alphabetical": this.sortAlphabet(); break;
		) {
		}
	}

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
				console.log("SEARCHED");
				console.log(urlStr);
				break;
			case "Reviews":
				urlStr =
					this.reviewUrl +
					this.search +
					`&group=true&group.field=appId&group.limit=1&group.ngroups=true`;
				break;
		}

		let nextrow = this.currentpage * 10;
		let previousrow = nextrow - 10;
		urlStr += `&rows=10&start=${previousrow}`;
		console.log(urlStr);
		this._api.getApps(urlStr).subscribe(
			(data) => {
				this.jsonList = data;
				this.amountofpages();
				this.responseStrip();
			},
			(err) => console.error(err),
			() => {
				console.log(urlStr);
				this.update();
			}
		);
	}

	responseStrip() {
		switch (this.category) {
			case "Apps":
				this.jsonList = this.jsonList.response.docs;
				break;
			case "Reviews":
				if (this.jsonList.grouped.appId.groups)
					this.jsonList = this.jsonList.grouped.appId.groups;
				console.log(this.jsonList);
				break;
		}
	}

	amountofpages() {
		let remainder = 0;
		if (this.category == "Apps") {
			this.pagenum = Math.floor(this.jsonList.response.numFound / 10);
			remainder = <number>this.jsonList.response.numFound % 10;
		} else if (this.category == "Reviews") {
			this.pagenum = Math.floor(this.jsonList.grouped.appId.ngroups / 10);
			remainder = <number>this.jsonList.grouped.appId.ngroups % 10;
		}

		if (remainder > 0) {
			this.pagenum += 1;
		}
		console.log(this.pagenum);
		this.pageRange = Array.from(Array(this.pagenum).keys()).map(
			(i) => i + 1
		);
	}
	changePage(page) {
		this.redirectTo(["/resultpage"], {
			state: {
				currentpage: page,
			},
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
		if (this.category == "Apps") {
			let length = Object.keys(this.jsonList);

			for (let entry of length) {
				let current = this.jsonList[entry];

				this.resultList.push(
					new appresult(
						current.id,
						current.icon,
						current.title,
						current.description,
						current.genre,
						current.scoreText,
						current.appId
					)
				);
			}
		} else if (this.category == "Reviews") {
			let length = this.jsonList.length;
			for (let i = 0; i < length; i++) {
				let current = this.jsonList[i].doclist.docs[0];
				this.resultList.push(
					new appresult(
						"",
						current.appImage,
						current.appName,
						"",
						"",
						"",
						current.appId
					)
				);
			}
		}

		console.log(this.resultList);
	}

	ngOnInit() {
		this.search = this._search.getquery();
		this.category = this._search.getstate();
		this.fetch();
	}
}

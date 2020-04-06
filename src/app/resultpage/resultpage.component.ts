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

	/**
	 * Constructor for result page.
	 *
	 * @param router
	 * @param _api
	 * @param _search
	 */
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

	/**
	 * Update suggestion for query if suggestion exists.
	 */
	correctlyspelled() {
		this.suggestionExist = !this.jsonList.spellcheck.correctlySpelled;
		this.suggestion = this.jsonList.spellcheck.suggestions[1].suggestion[0].word;
	}

	/**
	 * Fetch list of apps from solr API.
	 */
	fetch() {
		let urlStr = "";
		switch (this.category) {
			case "Apps":
				urlStr = this.appUrl + this.search;
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

	/**
	 * Extract relevant data after fetching from solr API.
	 */
	responseStrip() {
		switch (this.category) {
			case "Apps":
				this.jsonList = this.jsonList.response.docs;
				break;
			case "Reviews":
				if (this.jsonList.grouped.appId.groups)
					this.jsonList = this.jsonList.grouped.appId.groups;
				break;
		}
	}

	/**
	 * Calculate amount of pages from total result count.
	 */
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

		this.pageRange = Array.from(Array(this.pagenum).keys()).map(
			(i) => i + 1
		);
	}

	/**
	 * Redirect to the indicated page number.
	 *
	 * @param page Page number to redirect to
	 */
	changePage(page) {
		this.redirectTo(["/resultpage"], {
			state: {
				currentpage: page,
			},
		});
	}

	/**
	 * Redirect to the provided uri.
	 *
	 * @param uri URI to be redirected to
	 * @param data Additional parameters to be passed
	 */
	redirectTo(uri: string[], data: NavigationExtras) {
		this.router
			.navigateByUrl("/", { skipLocationChange: true })
			.then(() => this.router.navigate(uri, data));
	}

	/**
	 * Update fetched data.
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

	/**
	 * Called on angular component initialization.
	 */
	ngOnInit() {
		this.search = this._search.getquery();
		this.category = this._search.getstate();
		this.fetch();
	}
}

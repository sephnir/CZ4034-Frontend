import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { APIservice, APIspellcheck, searchbarhistory } from "../api.service";

@Component({
	selector: "app-searchbar",
	templateUrl: "./searchbar.component.html",
	styleUrls: ["./searchbar.component.scss"],
})
export class SearchbarComponent implements OnInit {
	searchVal: string;
	dropDown: string[];
	catstring: String;
	jsonList: any;
	suggestionlist: string[];
	dict: any;
	remainingstring: string;

	constructor(
		private router: Router,
		private _api: APIservice,
		private _spellcheck: APIspellcheck,
		private _search: searchbarhistory
	) {
		this.suggestionlist = [];
		this.dropDown = ["Apps", "Reviews"];
		this.catstring;
		this.jsonList = {};
	}

	updatesearch(value: string) {
		if (this.catstring == "Apps") {
			this.searchVal = value;
		} else {
			this.searchVal = this.remainingstring += " " + value;
		}
		this.suggestionlist = [];
		document.getElementById("searchbar").focus();
	}

	trim(s: string) {
		//let a = s.replace(/[!@#$%^&:///;,.//*]/g, " ").normalize("NFC");
		//let a = s.normalize("NFC");
		let a = s.replace(/([!@#:;,/])/g, " ").normalize("NFC");
		return a.replace(/\s\s+/g, " ");
	}

	fetch(value: string) {
		if (value === "") {
			this.suggestionlist = [];
		}
		if (this.catstring == "Apps") {
			var url =
				"http://18.141.144.113:8983/solr/appreviews/autocomplete?q=" +
				value;
			this._api.getApps(url).subscribe(
				(data) => {
					this.jsonList = <JSON>data;
				},
				(err) => console.error(err),
				() => {
					let returnvalue = this.jsonList.suggest.mySuggester[value]
						.suggestions;
					this.suggestionlist = [];
					for (let index in returnvalue) {
						this.suggestionlist.push(returnvalue[index].term);
					}
				}
			);
		} else {
			this.dict = this._spellcheck.getdict();
			if (value !== "" && this.dict) {
				value = value.replace(/\s\s+/g, " ");
				let bagofwords = value.split(" ");
				this.remainingstring = bagofwords.slice(0, -1).join(" ");
				let b = bagofwords.pop();
				let r = this.dict.checkAndSuggest(b, [5], [2]);
				if (r.misspelled == true) {
					this.suggestionlist = r.suggestions;
				} else {
					this.suggestionlist = [];
				}
			}
		}
	}

	/**
	 * Update searchVal
	 * @param event
	 */

	update(event: any) {
		this.searchVal = event.target.value;

		let searchbar = document.querySelector(".searchbar");
		if (searchbar.className.includes("is-invalid")) {
			searchbar.className = searchbar.className.replace("is-invalid", "");
		} else {
			this.fetch(this.searchVal);
		}
	}
	externalsearch(cat: string, query: string) {
		this.catstring = cat;
		this.searchVal = query;
		this.search();
	}

	/**
	 * Validate search field and redirect to result page
	 */
	search() {
		if (this.searchVal == "" || this.searchVal == null) {
			let searchbar = document.querySelector(".searchbar");
			if (!searchbar.className.includes("is-invalid"))
				searchbar.className = searchbar.className + " is-invalid";
			return;
		}
		this._search.setquery(this.catstring, this.trim(this.searchVal));
		this.redirectTo(["/resultpage"], {
			state: {
				currentpage: 1,
			},
		});
	}

	/**
	 * Redirect to result page
	 * @param uri Route to redirect to
	 * @param data Additional data
	 */
	redirectTo(uri: string[], data: NavigationExtras) {
		this.router
			.navigateByUrl("/", { skipLocationChange: true })
			.then(() => this.router.navigate(uri, data));
	}

	clear() {
		this.suggestionlist = [];
	}

	ngOnInit() {
		if (this._search.getstate() == null) {
			this.catstring = this.dropDown[0];
		} else {
			this.catstring = this._search.getstate();
		}
		if (this._search.getquery != null) {
			this.searchVal = this._search.getquery();
		}
	}
}

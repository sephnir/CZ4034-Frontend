import { Input, Component, OnInit } from "@angular/core";
import { APIservice, searchbarhistory, APIspellcheck } from "../api.service";
import { Router } from "@angular/router";
import { reviewinstance } from "./reviewinstance.app.model";
import { SearchbarComponent } from "../searchbar/searchbar.component";
import * as st from "stopword";

@Component({
	selector: "app-appreview",
	templateUrl: "./appreview.component.html",
	styleUrls: ["./appreview.component.scss"],
})
export class AppreviewComponent implements OnInit {
	@Input() appId: string;
	state: string;
	query: string;
	sortingselected = ["Sentiment", "Usefulness", "Review Score"];
	currentselected = this.sortingselected[0];

	private readonly appUrl =
		"http://18.141.144.113:8983/solr/appreviews/query?";
	jsonList: any;

	reviewInst: reviewinstance[];

	/**
	 * Constructor of appreview component.
	 *
	 * @param router
	 * @param _api
	 * @param _spellcheck
	 * @param _search
	 */
	constructor(
		private router: Router,
		private _api: APIservice,
		private _spellcheck: APIspellcheck,
		private _search: searchbarhistory
	) {
		this.state = _search.getstate();
		this.query = _search.getquery();
	}

	/**
	 * Called on angular component initialization.
	 */
	ngOnInit() {
		this.fetch();
	}

	/**
	 * Find the top 3 frequent string from review and perform a 'similar review' search.
	 *
	 * @param review String to perform the processing on
	 */
	frequent_string(review) {
		let textStr = review[0].replace(/[^a-z0-9]+|\s+/gim, " ");
		textStr = textStr.normalize("NFC").toLowerCase();

		let text = textStr.split(" ");

		text = st.removeStopwords(text);
		text = text.filter((item) => item !== "");

		let text1 = text.join(" ");
		let additionaltext = "";

		if (text1.length > 10) {
			var wordCounts = {};
			var words = text1.split(/\b/);

			for (var i = 0; i < words.length; i++) {
				if (words[i].length > 2) {
					wordCounts[words[i]] =
						(wordCounts[words[i].toLowerCase()] || 0) + 1;
				}
			}

			delete wordCounts[" "];
			for (let i = 0; i < 3; i++) {
				var max = Math.max.apply(
					null,
					Object.keys(wordCounts).map(function (x) {
						return wordCounts[x];
					})
				);
				const key = Object.keys(wordCounts).find(
					(key) => wordCounts[key] === max
				);
				additionaltext += " " + key;
				delete wordCounts[key];
			}
			console.log(additionaltext);
		} else {
			additionaltext = text1;
		}

		let sb = new SearchbarComponent(
			this.router,
			this._api,
			this._spellcheck,
			this._search
		);
		sb.externalsearch("Reviews", additionaltext);
	}
	/**
	 * Fetch data from solr API using app ID.
	 */

	fetch() {
		let urlStr = this.appUrl;
		if (this.state != "Reviews") {
			urlStr += `fq=appId%3A${this.appId}&q=*&rows=60`;
			console.log("Review query");
			console.log(urlStr);
		} else {
			urlStr += `fq=appId%3A${this.appId}&q=${this.query}&rows=60`;
		}

		this._api.getApps(urlStr).subscribe(
			(data) => {
				this.jsonList = data;
			},
			(err) => console.error(err),
			() => {
				console.log(urlStr);
				this.responseStrip();
				this.update();
				this.sortArray();
			}
		);
	}

	/**
	 * Extract relevant data after fetching from solr API.
	 */
	responseStrip() {
		this.jsonList = this.jsonList.response.docs;
	}

	/**
	 * Perform sorting on the review list depending on which tab is selected.
	 */
	sortArray() {
		switch (this.currentselected) {
			case "Sentiment":
				console.log("sent");
				this.reviewInst.sort((a, b) => {
					if (a.sentiment > b.sentiment) return -1;
					if (a.sentiment < b.sentiment) return 1;
					return 0;
				});
				break;
			case "Usefulness":
				this.reviewInst.sort((a, b) => {
					if (a.useful > b.useful) return -1;
					if (a.useful < b.useful) return 1;
					return 0;
				});
				break;
			case "Review Score":
				this.reviewInst.sort((a, b) => {
					if (parseInt(a.score) > parseInt(b.score)) return -1;
					if (parseInt(a.score) < parseInt(b.score)) return 1;
					return 0;
				});
				break;
		}
	}

	/**
	 * Update fields after fetching from solr API.
	 */
	update() {
		console.log("JSON" + <JSON>this.jsonList);
		let length = Object.keys(this.jsonList);
		this.reviewInst = [];
		for (let entry of length) {
			let current = this.jsonList[entry];
			this.reviewInst.push(
				new reviewinstance(
					current.reviewUserName,
					current.review,
					current.reviewScore,
					current.reviewThumbsUp,
					current.reviewUserImage,
					current.reviewDate,
					current.Sentiment,
					current.useful
				)
			);
		}
	}
}

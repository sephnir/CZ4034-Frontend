import { Input, Component, OnInit } from "@angular/core";
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { Router } from "@angular/router";
import { APIservice, APIspellcheck, searchbarhistory } from "../api.service";
import * as st from "stopword";

@Component({
	selector: "app-description",
	templateUrl: "./description.component.html",
	styleUrls: ["./description.component.scss"],
})
export class DescriptionComponent implements OnInit {
	@Input() title: string;

	private readonly appUrl = "http://18.141.144.113:8983/solr/apps/query?q=";
	jsonList: any;
	description: string;
	descriptionRaw: string;
	score: string;

	constructor(
		private router: Router,
		private _api: APIservice,
		private _spellcheck: APIspellcheck,
		private _search: searchbarhistory
	) {}

	ngOnInit() {
		this.fetch();
	}

	/**
	 * Find the most frequent string from description
	 */
	frequent_string() {
		let textStr = this.descriptionRaw.replace(/[^a-z0-9]+|\s+/gim, " ");
		textStr = textStr.normalize("NFC").toLowerCase();

		let text = textStr.split(" ")

		text = st.removeStopwords(text);
		text = text.filter((item) => item !== "");

		let text1 = text.join(" ")

		var wordCounts = { };
		var words = text1.split(/\b/);

		for(var i = 0; i < words.length; i++){
				if (words[i].length > 2){
				wordCounts[ words[i]] = (wordCounts[ words[i].toLowerCase()] || 0) + 1;}
			
		}
		
		delete (wordCounts[" "])
		let additionaltext =""
		for (let i = 0; i<3; i++){
			var max = Math.max.apply(null,Object.keys(wordCounts).map(function(x){ return wordCounts[x] }));
			const key = Object.keys(wordCounts).find(key => wordCounts[key] === max);
			additionaltext += " " + key
			delete(wordCounts[key])
		}
		console.log(additionaltext)
		/*
		const mostFrequent = (data) =>
			data.reduce(
				(r, c, i, a) => {
					r[c] = (r[c] || 0) + 1;
					r.max = r[c] > r.max ? r[c] : r.max;
					if (i == a.length - 1) {
						r = Object.entries(r).filter(
							([k, v]) => v == r.max && k != "max"
						);
						return r.map((x) => x[0]);
					}
					return r;
				},
				{ max: 2 }
			);
		let this_text_arr = mostFrequent(text);
		let temp = [];
		this_text_arr.forEach((element) => {
			if (element.length >= 2) {
				temp.push(element);
			}
		});

		let this_text = temp.join(" ");
		console.log(mostFrequent(text));
		*/
		let sb = new SearchbarComponent(
			this.router,
			this._api,
			this._spellcheck,
			this._search
		);
		

		sb.externalsearch("Apps", additionaltext);
		
	}

	fetch(redirect = false) {
		let urlStr = this.appUrl;
		this.title = this.title.replace(/([!@#:;,/])/g, " ").normalize("NFC");

		urlStr += `title%3A${this.title}`;

		this._api.getApps(urlStr).subscribe(
			(data) => {
				this.jsonList = data;
			},
			(err) => console.error(err),
			() => {
				console.log(urlStr);
				this.update();
				if (redirect) this.frequent_string();
			}
		);
	}

	update() {
		let temp = this.jsonList.response.docs;
		if (temp.length > 0) {
			this.descriptionRaw = temp[0].description;
			this.score = temp[0].score[0];
		}
		this.description = this.descriptionRaw.replace(/\n/g, "<br>");
	}
}

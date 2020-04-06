import { Component, Input, OnInit } from "@angular/core";
import { appresult } from "../resultpage/result.app.model";
import { Router } from "@angular/router";
import { APIservice, APIspellcheck, searchbarhistory } from "../api.service";
import { DescriptionComponent } from "../description/description.component";
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
	selector: "app-individualresult",
	templateUrl: "./individualresult.component.html",
	styleUrls: ["./individualresult.component.scss"],
})
export class IndividualresultComponent implements OnInit {
	@Input() resultinstance: appresult;

	currentTab: string;
	query: string;
	state: string;

	constructor(
		private router: Router,
		private _api: APIservice,
		private _spellcheck: APIspellcheck,
		private _search: searchbarhistory
	) {
		this.state = this._search.getstate();
		this.query = this._search.getstate();
	}

	ngOnInit() {
		//app -> description
		//review -> review
		this.currentTab = this.state;
	}
	changeTab(value) {
		this.currentTab = value;
	}

	similarApps() {
		console.log(this.state);
		if (this.state == "Reviews") {
			let sb = new SearchbarComponent(
				this.router,
				this._api,
				this._spellcheck,
				this._search
			);
			sb.externalsearch("Apps", this.resultinstance.title);
		}

		if (this.state == "Apps") {
			let dc = new DescriptionComponent(
				this.router,
				this._api,
				this._spellcheck,
				this._search
			);
			dc.title = this.resultinstance.title;
			dc.fetch(true);
		}
	}
}

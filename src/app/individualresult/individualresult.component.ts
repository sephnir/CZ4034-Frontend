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

	/**
	 * Constructor of individual result component.
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
		this.state = this._search.getstate();
		this.query = this._search.getstate();
	}

	/**
	 * Called on angular component initialization.
	 */
	ngOnInit() {
		this.currentTab = this.state;
	}

	/**
	 * Action to change the current tab.
	 *
	 * @param value String of the tab to change to.
	 */
	changeTab(value) {
		this.currentTab = value;
	}

	/**
	 * Action to perform a search on similar apps.
	 */
	similarApps() {
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

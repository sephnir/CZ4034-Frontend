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

	constructor(private _api: APIservice) {
		this.search = <string>history.state.data;
		this.fetch();
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
				new appresult(current.id, current.title, current.icon)
			);
		}

		console.log(this.resultList);
		console.log("TEST");
	}

	ngOnInit() {}
}

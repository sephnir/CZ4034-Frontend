import { Component, Input, OnInit } from "@angular/core";
import { appresult } from "../resultpage/result.app.model";
import{searchbarhistory} from "../api.service";


@Component({
	selector: "app-individualresult",
	templateUrl: "./individualresult.component.html",
	styleUrls: ["./individualresult.component.scss"]
})
export class IndividualresultComponent implements OnInit {
	@Input() resultinstance: appresult;

	currentTab: string;
	query : string;
	state : string;

	constructor(private _search : searchbarhistory) {
		this.state = this._search.getstate();
		this.query = this._search.getstate();
		
	}

	ngOnInit() {
		//app -> description
		//review -> review
		this.currentTab = this.state;
	}
	changeTab(value){
		this.currentTab = value;
	}
}

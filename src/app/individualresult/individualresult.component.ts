import { Component, Input, OnInit } from "@angular/core";
import { appresult } from "../resultpage/result.app.model";
import { APIservice } from "../api.service";


@Component({
	selector: "app-individualresult",
	templateUrl: "./individualresult.component.html",
	styleUrls: ["./individualresult.component.scss"]
})
export class IndividualresultComponent implements OnInit {
	@Input() resultinstance: appresult;
	@Input() state: string;

	currentTab: string;

	constructor() {
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

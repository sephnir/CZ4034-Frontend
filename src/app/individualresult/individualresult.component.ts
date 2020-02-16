import { Component, Input, OnInit } from "@angular/core";
import { appresult } from "../resultpage/result.app.model";

@Component({
	selector: "app-individualresult",
	templateUrl: "./individualresult.component.html",
	styleUrls: ["./individualresult.component.scss"]
})
export class IndividualresultComponent implements OnInit {
	@Input() resultinstance: appresult;

	constructor() {}

	ngOnInit() {}
}

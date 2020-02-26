import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

@Component({
	selector: "app-searchbar",
	templateUrl: "./searchbar.component.html",
	styleUrls: ["./searchbar.component.scss"]
})
export class SearchbarComponent implements OnInit {
	searchVal: string;
	dropDown: string[];
	catstring: String;

	constructor(private router: Router) {
		this.dropDown = ["All","Category A","Category B"];
		this.catstring = this.dropDown[0];
	}

	/**
	 * Update searchVal
	 * @param event
	 */

	
	update(event: any) {
		this.searchVal = event.target.value;

		let searchbar = document.querySelector(".searchbar");
		if (searchbar.className.includes("is-invalid"))
			searchbar.className = searchbar.className.replace("is-invalid", "");
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

		this.redirectTo(["/resultpage"], {
			state: { data: this.searchVal }
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


	setcat(){
		
	}


	ngOnInit() {}
}

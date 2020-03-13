import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { APIservice } from "../api.service";


@Component({
	selector: "app-searchbar",
	templateUrl: "./searchbar.component.html",
	styleUrls: ["./searchbar.component.scss"]
})
export class SearchbarComponent implements OnInit {
	searchVal: string;
	dropDown: string[];
	catstring: String;
	jsonList: any;
	suggestionlist: string[];
	

	constructor(private router: Router,private _api: APIservice) {
		this.dropDown = ["All","Apps","Reviews"];
		this.catstring = this.dropDown[0];
		this.jsonList = {};
	}

	updatesearch(value: string){
		this.searchVal = value;
	}

	fetch(value: string) {
		if(value === ""){
			this.suggestionlist =[]
		}
		
		var url = "http://18.141.144.113:8983/solr/appreviews/autocomplete?q="+value;
		this._api.getApps(url).subscribe(
			data => {
				(this.jsonList = <JSON>data)
			} ,
			err => console.error(err),
			() => {
				this.autocompletestrip(value);
			}
		);

	}

	autocompletestrip(value: string){
		this.suggestionlist = this.jsonList.suggest.mySuggester[value].suggestions;
	}
	
	/**
	 * Update searchVal
	 * @param event
	 */
	
	update(event: any) {
		this.searchVal = event.target.value;

		let searchbar = document.querySelector(".searchbar");
		if (searchbar.className.includes("is-invalid")){
			searchbar.className = searchbar.className.replace("is-invalid", "");}
		else{

			this.fetch(this.searchVal)
		}
		
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
			state: { 
				data: this.searchVal ,
				category: this.catstring,
				currentpage: 1
			}
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

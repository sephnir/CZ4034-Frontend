import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { APIservice,APIspellcheck } from "../api.service";




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
	dict: any
	remainingstring: string;

	constructor(private router: Router,private _api: APIservice,private _spellcheck: APIspellcheck) {
		this.suggestionlist = [];
		this.dropDown = ["All","Apps","Reviews"];
		this.catstring = this.dropDown[0];
		this.jsonList = {};
	}

	updatesearch(value: string){
		if (this.catstring == 'Apps'){
		this.searchVal = value;}
		else{
		this.searchVal = this.remainingstring += ' '+ value;}
		this.suggestionlist = []
	}

	trim(s:string){ 
		let a = s.replace(/[!@#$%^&:///;',.//*]/g, "").normalize('NFC');
		return a.replace(/\s\s+/g, ' ');
		
	  }

	fetch(value: string) {
		if(value === ""){
			this.suggestionlist =[]
		}
		if (this.catstring == 'Apps'){
		var url = "http://18.141.144.113:8983/solr/appreviews/autocomplete?q="+value;
		this._api.getApps(url).subscribe(
			data => {
				(this.jsonList = <JSON>data)
			} ,
			err => console.error(err),
			() => {
				let returnvalue = this.jsonList.suggest.mySuggester[value].suggestions;
				this.suggestionlist =[]
				for (let index in returnvalue){
					this.suggestionlist.push(returnvalue[index].term)
				}
			}
		);

	}
	else{
		this.dict = this._spellcheck.getdict()
		if (value !== ""){
		value = value.replace(/\s\s+/g, ' ');
		let bagofwords = value.split(" ")
		this.remainingstring = bagofwords.slice(0, -1).join(' ');
		let b = bagofwords.pop()
		let r = this.dict.checkAndSuggest(b ,[5] ,[2])
		if (r.misspelled == true){
			this.suggestionlist = (r.suggestions)
		}
		else{
			this.suggestionlist = []
		}
		}
	}
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
		console.log(this.trim(this.searchVal));
		this.redirectTo(["/resultpage"], {
			state: { 
				data: this.trim(this.searchVal) ,
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

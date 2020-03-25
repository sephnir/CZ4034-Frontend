import { Input, Component, OnInit } from '@angular/core';
import { APIservice, searchbarhistory,APIspellcheck } from "../api.service";
import { Router,  } from "@angular/router";
import {reviewinstance} from "./reviewinstance.app.model";
import { SearchbarComponent } from '../searchbar/searchbar.component';
import * as st from 'stopword';



@Component({
  selector: 'app-appreview',
  templateUrl: './appreview.component.html',
  styleUrls: ['./appreview.component.scss']
})
export class AppreviewComponent implements OnInit {
  @Input() appId: string;
  state:string;
  query:string;

  
  private readonly appUrl = "http://18.141.144.113:8983/solr/appreviews/query?";
  jsonList: any;
  
  reviewInst: reviewinstance[];
  
  constructor(private router: Router,private _api: APIservice,private _spellcheck: APIspellcheck,private _search: searchbarhistory)  { 
	  this.state = _search.getstate();
	  this.query = _search.getquery();
  }

  ngOnInit() {
    this.fetch();

  }
frequent_string(description){
	description = description[0]
	let searchterm = ''
	let textStr = description.replace(/[^a-z0-9]+|\s+/gmi, " ");

	textStr = textStr.normalize('NFC');
	textStr = textStr.replace(/(\\n)+/g, " ");
	let text = textStr.split(" ");

	text = st.removeStopwords(text);
	text = text.filter(item => item !== '');

	if (text.length >  10){
		const mostFrequent = data => data.reduce((r,c,i,a) => {
			r[c] = (r[c] || 0) + 1
			r.max = r[c] > r.max ? r[c] : r.max
			if(i == a.length-1) {
			r = Object.entries(r).filter(([k,v]) => v == r.max && k != 'max')
			return r.map(x => x[0])
			}
			return r
		}, {max: 0})
		searchterm = mostFrequent(text).join(' ');
	
	}
	else{
		searchterm = text.join(' ');
	}
	
	let sb = new SearchbarComponent(this.router, this._api, this._spellcheck, this._search);
	sb.externalsearch('Reviews',searchterm);

}
  

  /**
	 * Fetch data from backend
	 */

	fetch() {
    let urlStr = this.appUrl;
    if (this.state != "Reviews"){
		  urlStr += `fq=appId%3A${this.appId}&q=*&rows=60`;
    }
    else{ 
      urlStr += `fq=appId%3A${this.appId}&q=${this.query}&rows=60`;
    }
    
		this._api.getApps(urlStr).subscribe(
			data => {
				this.jsonList = data;
			},
			err => console.error(err),
			() => {
        console.log(urlStr);
        this.responseStrip();
				this.update();
				//this.correctlyspelled()
			}
		);
  }
  
	responseStrip() {
		this.jsonList = this.jsonList.response.docs;
	}

  update(){
		console.log("JSON" + <JSON>this.jsonList);
		let length = Object.keys(this.jsonList);
		this.reviewInst = [];
		for (let entry of length) {
			let current = this.jsonList[entry];
			this.reviewInst.push(
				new reviewinstance(
					current.reviewUserName,
					current.review,
					current.reviewScore,
					current.reviewThumbsUp,
					current.appImage,
					current.reviewDate,
					current.Sentiment,
					current.useful
				)
			);
		}
  	}
}


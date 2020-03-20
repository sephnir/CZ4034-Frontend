import { Input, Component, OnInit } from '@angular/core';
import { APIservice, searchbarhistory } from "../api.service";
import {reviewinstance} from "./reviewinstance.app.model";


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
  
  constructor( private _api: APIservice ,private _search :searchbarhistory) { 
	  this.state = _search.getstate();
	  this.query = _search.getquery();
  }

  ngOnInit() {
    this.fetch();

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
					current.reviewDate
				)
			);
		}
  }
}

import { Input, Component, OnInit } from '@angular/core';
import { APIservice } from "../api.service";
import * as st from 'stopword';


@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit { 
  @Input() title: string;

  private readonly appUrl = "http://18.141.144.113:8983/solr/apps/query?q=";
  jsonList: any;
  description: string;
  
  constructor( private _api: APIservice) { 
  }

  ngOnInit() {
    this.fetch();

  }

  /**
	 * Fetch data from backend
	 */


  frequent_string(){
    let textStr = this.description.replace(/[^A-Za-z0-9\s]+/g, "")
    textStr = textStr.replace(/(\\n)+/g, " ");
    let text = textStr.split(" ");

    text = st.removeStopwords(text);
    text = text.filter(item => item !== '');
    console.log(text)

    const mostFrequent = data => data.reduce((r,c,i,a) => {
      r[c] = (r[c] || 0) + 1
      r.max = r[c] > r.max ? r[c] : r.max
      if(i == a.length-1) {
        r = Object.entries(r).filter(([k,v]) => v == r.max && k != 'max')
        return r.map(x => x[0])
      }
      return r
    }, {max: 0})
    
    console.log(mostFrequent(text))

  }

	fetch() {
    let urlStr = this.appUrl;
    this.title = this.title.replace(/([!@#$%^&:///;',.//*])/g, "").normalize('NFC');

    urlStr += `title%3A${this.title}`;
    
		this._api.getApps(urlStr).subscribe(
			data => {
				this.jsonList = data;
			},
			err => console.error(err),
			() => {
				console.log(urlStr);
				this.update();
				//this.correctlyspelled()
			}
		);
		//
	}

  update(){
    let temp = this.jsonList.response.docs;
    if(temp.length > 0){
      this.description = temp[0].description;
    }
  }
}

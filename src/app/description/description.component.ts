import { Input, Component, OnInit } from '@angular/core';
import { APIservice } from "../api.service";

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit { 
  @Input() id: string;

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

	fetch() {
		let urlStr = this.appUrl;
    urlStr += `id%3A${this.id}`;
    
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

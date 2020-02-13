import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {APIservice} from '../api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {
   name;
   url;
   datac;


  constructor(private _api: APIservice, private router:Router) {
    this.name = new FormControl('');
    this.url = "http://www.mocky.io/v2/5e44e565300000393061469e";

   }
   getsearch(){
     this._api.getApps(this.url).subscribe(
       data => {this.datac = data;},
       err => console.error(err), 
       () => 
       {
       console.log('done loading APPS');
       this.router.navigate(['/resultpage'],{state: {data: this.datac}});
        }
       ); 
  }


  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {appresult} from './result.app.model';

@Component({
  selector: 'app-resultpage',
  templateUrl: './resultpage.component.html',
  styleUrls: ['./resultpage.component.scss']
})
export class ResultpageComponent implements OnInit {
  resultlist :appresult [] = []

  constructor() {
    let jsonlist = history.state.data;
    let length = (Object.keys(jsonlist))

    for (let entry of length){
      let current = jsonlist[entry];
      this.resultlist.push( new appresult(current.id,current.title,current.icon));
    }
    console.log(this.resultlist);
    console.log('TEST')
   }

  ngOnInit() {
  }

}

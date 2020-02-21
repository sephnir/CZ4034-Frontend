import { RouterModule, Routes } from '@angular/router';
import { NgModule }              from '@angular/core';


import { MainpageComponent } from './mainpage/mainpage.component';
import { ResultpageComponent } from './resultpage/resultpage.component';
import {RootpageComponent} from './rootpage/rootpage.component';
import {IndividualresultComponent} from './individualresult/individualresult.component';
import { SearchbarComponent } from './searchbar/searchbar.component';


const appRoutes: Routes = [
    { path: 'mainpage', component: MainpageComponent },
    { path: 'resultpage', component: ResultpageComponent },
    { path: '',   redirectTo: '/mainpage', pathMatch: 'full' },
  ];
  

@NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
      )
    ],
    exports: [
      RouterModule
    ]
  })

  export class AppRoutingModule {}
  export const routingcomponents = [RootpageComponent,MainpageComponent,ResultpageComponent,IndividualresultComponent,SearchbarComponent]

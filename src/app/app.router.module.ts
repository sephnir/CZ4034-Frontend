import { RouterModule, Routes } from '@angular/router';
import { NgModule }              from '@angular/core';


import { MainpageComponent } from './mainpage/mainpage.component';
import { ResultpageComponent } from './resultpage/resultpage.component';
import {XyzComponent} from './xyz/xyz.component';
import {RootpageComponent} from './rootpage/rootpage.component';

const appRoutes: Routes = [
    { path: 'mainpage', component: MainpageComponent },
    { path: 'resultpage', component: ResultpageComponent },
    { path: 'xyz', component: XyzComponent },
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
  export const routingcomponents = [RootpageComponent,MainpageComponent,ResultpageComponent,XyzComponent]

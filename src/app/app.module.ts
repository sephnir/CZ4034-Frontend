import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRoutingModule,routingcomponents} from './app.router.module';


@NgModule({
  declarations: [
    routingcomponents
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [routingcomponents[0]]
})
export class AppModule { }

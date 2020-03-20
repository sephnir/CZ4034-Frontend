import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRoutingModule,routingcomponents} from './app.router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpellCheckerModule } from 'ngx-spellchecker';
import { SpellCheckerService } from 'ngx-spellchecker'; 



@NgModule({
  declarations: [
    routingcomponents,
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SpellCheckerModule,

  ],
  providers: [SpellCheckerService],
  bootstrap: [routingcomponents[0]]
})
export class AppModule { }

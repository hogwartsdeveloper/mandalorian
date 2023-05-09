import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroComponent } from './intro/intro.component';
import {IntroRoutingModule} from "./intro-routing.module";



@NgModule({
  declarations: [
    IntroComponent
  ],
  imports: [
    CommonModule,
    IntroRoutingModule
  ]
})
export class IntroModule { }

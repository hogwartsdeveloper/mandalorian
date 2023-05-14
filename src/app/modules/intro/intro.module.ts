import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroComponent } from './intro/intro.component';
import {IntroRoutingModule} from "./intro-routing.module";
import {LoadingComponent} from "../loading/loading.component";



@NgModule({
  declarations: [
    IntroComponent
  ],
    imports: [
        CommonModule,
        IntroRoutingModule,
        LoadingComponent
    ]
})
export class IntroModule { }

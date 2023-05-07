import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import { ScorePipe } from './pipes/score.pipe';
import {ScoreService} from "./services/score.service";
import {LoadingComponent} from "./modules/loading/loading.component";

@NgModule({
  declarations: [
    AppComponent,
    ScorePipe
  ],
  imports: [
    BrowserModule,
    LoadingComponent
  ],
  providers: [ScoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }

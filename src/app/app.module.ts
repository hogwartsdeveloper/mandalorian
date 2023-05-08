import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ScorePipe} from './pipes/score.pipe';
import {ScoreService} from "./services/score.service";
import {LoadingComponent} from "./modules/loading/loading.component";
import {LevelService} from "./services/level.service";
import {ScoreDirective} from './directives/score.directive';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    ScorePipe,
    ScoreDirective
  ],
  imports: [
    BrowserModule,
    LoadingComponent,
    BrowserAnimationsModule
  ],
  providers: [ScoreService, LevelService],
  bootstrap: [AppComponent]
})
export class AppModule { }

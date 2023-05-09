import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from './game/game.component';
import {GameRouterModule} from "./game-router.module";
import {LoadingComponent} from "../loading/loading.component";
import {ScoreDirective} from "../../directives/score.directive";
import {ScorePipe} from "../../pipes/score.pipe";


@NgModule({
  declarations: [
    GameComponent,
    ScoreDirective,
    ScorePipe
  ],
  imports: [
    CommonModule,
    GameRouterModule,
    LoadingComponent,
  ]
})
export class GameModule { }

import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
    { path: '', component: GameComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GameRouterModule {}
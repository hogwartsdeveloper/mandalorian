import {RouterModule, Routes} from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: 'intro', loadChildren: () => import('./modules/intro/intro.module').then((m) => m.IntroModule)},
    { path: 'game', loadChildren: () => import('./modules/game/game.module').then((m) => m.GameModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
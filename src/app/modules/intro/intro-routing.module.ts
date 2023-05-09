import {RouterModule, Routes} from "@angular/router";
import {IntroComponent} from "./intro/intro.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
    { path: '', component: IntroComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntroRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BowlingStatsComponent } from './bowling-stats.component';

const routes: Routes = [
    {
        path: '',
        component: BowlingStatsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BowlingStatsRoutingModule {}

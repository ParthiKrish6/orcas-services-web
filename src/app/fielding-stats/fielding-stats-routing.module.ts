import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldingStatsComponent } from './fielding-stats.component';

const routes: Routes = [
    {
        path: '',
        component: FieldingStatsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldingStatsRoutingModule {}

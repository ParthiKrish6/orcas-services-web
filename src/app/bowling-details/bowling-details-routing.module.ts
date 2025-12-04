import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BowlingDetailsComponent } from './bowling-details.component';

const routes: Routes = [
    {
        path: '',
        component: BowlingDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BowlingDetailsRoutingModule {}

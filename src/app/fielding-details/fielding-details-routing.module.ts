import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldingDetailsComponent } from './fielding-details.component';

const routes: Routes = [
    {
        path: '',
        component: FieldingDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldingDetailsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattingDetailsComponent } from './batting-details.component';

const routes: Routes = [
    {
        path: '',
        component: BattingDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BattingDetailsRoutingModule {}

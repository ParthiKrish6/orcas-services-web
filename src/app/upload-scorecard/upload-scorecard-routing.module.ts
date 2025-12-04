import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadScoreCardComponent } from './upload-scorecard.component';

const routes: Routes = [
    {
        path: '',
        component: UploadScoreCardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadScoreCardRoutingModule {}

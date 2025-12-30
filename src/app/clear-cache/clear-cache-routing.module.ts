import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClearCacheComponent } from './clear-cache.component';

const routes: Routes = [
    {
        path: '',
        component: ClearCacheComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClearCacheRoutingModule {}

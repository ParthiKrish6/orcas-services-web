import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClearCacheRoutingModule } from './clear-cache-routing.module';
import { ClearCacheComponent } from './clear-cache.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [CommonModule, ClearCacheRoutingModule, ReactiveFormsModule, NgxSpinnerModule],
    declarations: [ClearCacheComponent], 
})
export class ClearCacheModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [FormsModule , CommonModule, NgbCarouselModule, NgbAlertModule, DashboardRoutingModule,  NgxSpinnerModule],
    declarations: [DashboardComponent]
})
export class DashboardModule {}

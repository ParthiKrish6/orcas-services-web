import { NgModule } from '@angular/core';

import { BarChartRoutingModule } from './bar-chart-routing.module';
import { BarChartComponent } from './bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, BarChartRoutingModule, ChartsModule],
    declarations: [BarChartComponent]
})
export class BarChartModule {}

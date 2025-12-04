import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ChartData } from './chart-data';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent {

  chartOptions: string[];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  chartDataArray: ChartData[];
 
  
  constructor() {

  }

  ngOnInit() {
    this.chartOptions = [
      "All",
      "Top 10",
      "Top 25",
      "Top 50",
      "Least 10",
      "Least 25",
      "Least 50",
    ];
  }

  loadBarChart() {
    this.chartDataArray = new Array<ChartData>();
    this.assignBarChartData(this.sortMap(this.chartDataArray, false), this.chartDataArray.length);
  }

  assignBarChartData(chartDataArray: ChartData[], maxRecords: number) {
    let i = 0;
    let dataArr: number[] = new Array<number>();
    let labels: string[] = new Array<string>();
    let data: ChartDataSets;
    let finalData: ChartDataSets[] = new Array<ChartDataSets>();
    chartDataArray.forEach((data) => {
      if (i < maxRecords) {
        labels.push(data.productName);
        dataArr.push(data.profitAmount);
        i++;
      } else {
        //Do Nothing
      }
    });

    data = { data: dataArr, label: 'Best Profitted Product' };
    finalData[0] = data;
    this.barChartLabels = labels;
    this.barChartData = finalData;
  }

  sortMap(unsorted: ChartData[], asc: boolean): ChartData[] {
    let sorted: ChartData[] = new Array<ChartData>();
    if (asc) {
      sorted = unsorted.sort(function (a, b) {
        return a.profitAmount - b.profitAmount;
      });
    } else {
      sorted = unsorted.sort(function (a, b) {
        return b.profitAmount - a.profitAmount;
      });
    }
    return sorted;
  }

  setBarChartOption(id: string) {
    if (id.startsWith("Top")) {
      const sortedMap = this.sortMap(this.chartDataArray, false);
      if (id === "Top 10") {
        this.assignBarChartData(sortedMap, 10);
      } else if (id === "Top 25") {
        this.assignBarChartData(sortedMap, 25);
      } else if (id === "Top 50") {
        this.assignBarChartData(sortedMap, 50);
      }
    } else if (id.startsWith("Least")) {
      const sortedMap = this.sortMap(this.chartDataArray, true);
      if (id === "Least 10") {
        this.assignBarChartData(sortedMap, 10);
      } else if (id === "Least 25") {
        this.assignBarChartData(sortedMap, 25);
      } else if (id === "Least 50") {
        this.assignBarChartData(sortedMap, 50);
      }
    } else {
      this.assignBarChartData(this.chartDataArray, this.chartDataArray.length);
    }
  }

  getProductWiseProfitLoss(productId: number): number[] {
    let returnArray: number[] = new Array<number>();
    let saleValue = 0;
    let profitLoss = 0;
   
    returnArray[0] = saleValue;
    returnArray[1] = profitLoss;
    return returnArray;
  }
}
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stats-popup',
  templateUrl: './stats-popup.component.html',
  styleUrls: ['./stats-popup.component.css']
})
export class StatsPopupComponent {

  displayedColumns : string[];
  playerimage: string;
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  header5: string;
  matchStats: any[];
  team: string;
  from: string;
  to: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.matchStats = data.matchStats;
    this.header1 = data.header1;
    this.header2 = data.header2;
    this.header3 = data.header3;
    this.header4 = data.header4;
    this.header5 = data.header5;
    this.team = data.team;
    this.from = data.from;
    this.to = data.to;
    this.displayedColumns = [data.column1, data.column2, data.column3, data.column4];
    this.playerimage = data.playerimage;
  }
}
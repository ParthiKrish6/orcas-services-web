import { Component, Inject, ViewChild, Optional } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { MatchStats } from './match-stats';

@Component({
  selector: 'app-stats-popup',
  templateUrl: './stats-popup.component.html',
  styleUrls: ['./stats-popup.component.css']
})
export class StatsPopupComponent {

  displayedColumns: string[];
  dataSource = new MatTableDataSource<MatchStats>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  playerimage: string;
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  header5: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  name: string;
  team: string;
  from: string;
  to: string;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.header1 = data.header1;
    this.header2 = data.header2;
    this.header3 = data.header3;
    this.header4 = data.header4;
    this.header5 = data.header5;
    this.team = data.team;
    this.name = data.playerName;
    this.from = data.from;
    this.to = data.to;
    this.displayedColumns = [data.header1, data.header2, data.header3, data.header4, data.header5];
    this.column1 = data.header1;
    this.column2 = data.header2;
    this.column3 = data.header3;
    this.column4 = data.header4;
    this.column5 = data.header5;
    this.playerimage = data.playerimage;
    this.dataSource = new MatTableDataSource(data.matchStats); 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
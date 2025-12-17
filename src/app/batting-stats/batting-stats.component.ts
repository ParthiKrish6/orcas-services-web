import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BattingStatsService } from './batting-stats.service';
import { BattingStats } from './batting-stats';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CalendarDetailsService } from '../calendar-details/calendar-details.service';
import { CalendarDetails } from '../calendar-details/calendar-details';
import { TeamDetailsService } from '../team-details/team-details.service';
import { TeamDetails } from '../team-details/team-details';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-batting-stats-list',
  templateUrl: './batting-stats.component.html',
  styleUrls: ['./batting-stats.component.css']
})
export class BattingStatsComponent implements OnInit {

  dataSource: MatTableDataSource<BattingStats>;  
  displayedColumns: string[] = ['player','innings','runs','balls','fours','sixes','average','strikeRate','notOut','timeSpent'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
  @ViewChild('team') teamDropdownElement!: ElementRef;
  
  errorMsg: string;
  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  
  constructor(
    private battingStatsService: BattingStatsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.spinnerService.show();
    this.teamDetailsService.getTeamDetailsList().subscribe(data => {
      this.teamOptions = data;
      this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
        this.anniversaryOptions = data;
        this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
        this.battingStatsService.getBattingStatsList().subscribe(data => {
          this.setBattingStats(data);
        });
      });
    },error => {
      console.log(error);
      this.errorMsg = error.error.message;
      this.router.navigate(['/login'], {
        skipLocationChange: true,
        queryParams: { errMsg: error.error.message }
      });
    });
  }

  filterStats(anniversary, teamId) {
    this.spinnerService.show();
    if(anniversary == "0" && teamId == "0") {
      this.reloadData();
    } else if(anniversary != "0" && teamId == "0") {
      this.calendarDetailsService.getCalendarDetails(anniversary).subscribe(data => {
        this.battingStatsService.getBattingStatsBetweenDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.setBattingStats(data);
        });
      });
    } else if(anniversary == "0" && teamId != "0") {
      this.battingStatsService.getBattingStatsForTeam(teamId).subscribe(data => {
        this.setBattingStats(data);
      });
    } else if(anniversary != "0" && teamId != "0") {
      this.calendarDetailsService.getCalendarDetails(anniversary).subscribe(data => {
        this.battingStatsService.getBattingStatsBetweenDatesForTeam(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
          this.setBattingStats(data);
        });
      });
    }
  }

  filterAnniversaryStats(anniversary) {
    this.filterStats(anniversary, this.teamDropdownElement.nativeElement.value);
  }

  filterTeamStats(id) {
    this.filterStats(this.anniversaryDropdownElement.nativeElement.value, id);
  }

  setBattingStats(data) {
    this.dataSource = new MatTableDataSource(data);  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return JSON.stringify(data).toLowerCase().includes(searchString);
    };
    this.dataSource.paginator = this.paginator;  
    this.dataSource.sort = this.sort; 
    this.spinnerService.hide();
  }

  applyFilter(filterValue: string) {  
    this.dataSource.filter = filterValue.trim().toLowerCase();  
  
    if (this.dataSource.paginator) {  
      this.dataSource.paginator.firstPage();  
    }  
  }  

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BowlingStatsService } from './bowling-stats.service';
import { BowlingStats } from './bowling-stats';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CalendarDetailsService } from '../calendar-details/calendar-details.service';
import { CalendarDetails } from '../calendar-details/calendar-details';
import { TeamDetailsService } from '../team-details/team-details.service';
import { TeamDetails } from '../team-details/team-details';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bowling-stats-list',
  templateUrl: './bowling-stats.component.html',
  styleUrls: ['./bowling-stats.component.css']
})
export class BowlingStatsComponent implements OnInit {

  dataSource: MatTableDataSource<BowlingStats>;  
  displayedColumns: string[] = ['player','innings','overs', 'maidens', 'wickets', 'runs', 'economy', 'fours','sixes','average','strikeRate','dots','wides', 'noBalls'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
  @ViewChild('team') teamDropdownElement!: ElementRef;
  
  errorMsg: string;
  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  
  constructor(
    private bowlingStatsService: BowlingStatsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService
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
        this.bowlingStatsService.getBowlingStatsList().subscribe(data => {
          this.setBowlingStats(data);
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
        this.bowlingStatsService.getBowlingStatsBetweenDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.setBowlingStats(data);
        });
      });
    } else if(anniversary == "0" && teamId != "0") {
      this.bowlingStatsService.getBowlingStatsForTeam(teamId).subscribe(data => {
        this.setBowlingStats(data);
      });
    } else if(anniversary != "0" && teamId != "0") {
      this.calendarDetailsService.getCalendarDetails(anniversary).subscribe(data => {
        this.bowlingStatsService.getBowlingStatsBetweenDatesForTeam(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
          this.setBowlingStats(data);
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

  setBowlingStats(data) {
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

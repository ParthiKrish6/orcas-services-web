import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatchDetailsService } from './match-details.service';
import { MatchDetails } from './match-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './match-details-modal.component';
import * as moment from 'moment';
import { TeamDetailsService } from '../team-details/team-details.service';
import { CalendarDetailsService } from '../calendar-details/calendar-details.service';
import { CalendarDetails } from '../calendar-details/calendar-details';
import { TeamDetails } from '../team-details/team-details';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-match-details-list',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<MatchDetails>;
  displayedColumns: string[] = ['matchDate', 'team', 'matchResult'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
  @ViewChild('team') teamDropdownElement!: ElementRef;

  errorMsg: string;
  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  selectedTeamName: string;

  startDate: Date;
  endDate: Date;
  isAdmin: boolean;

  played: number = 0;
  won: number = 0;
  winPercentage: number = 0;
  batPlayed: number = 0;
  batWon: number = 0;
  batWinPercentage: number = 0;
  bowlPlayed: number = 0;
  bowlWon: number = 0;
  bowlWinPercentage: number = 0;

  constructor(
    private matchDetailsService: MatchDetailsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.reloadData();
    this.isAdmin = localStorage.getItem('authType') == 'A';
    if(this.isAdmin) {
      this.displayedColumns.push('teamScore');
      this.displayedColumns.push('opponent');
      this.displayedColumns.push('opponentScore');
      this.displayedColumns.push('batFirst');
      this.displayedColumns.push('action');
    }
  }

  reloadData() {
    this.spinnerService.show();
    this.teamDetailsService.getTeamDetailsList().subscribe(data => {
      this.teamOptions = data;
      this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
        this.anniversaryOptions = data;
        this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
        if(this.anniversaryOptions.length > 0) {
          this.startDate = this.anniversaryOptions[this.anniversaryOptions.length-1].startDate;
          this.endDate = this.anniversaryOptions[0].endDate;
          this.matchDetailsService.getMatchDetailsForDates(moment(this.anniversaryOptions[0].startDate).format('YYYY-MM-DD'), moment(this.anniversaryOptions[0].endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setMatchDetails(data);
          });
        } else {
          this.spinnerService.hide();
        }
      },error => {
        console.log(error);
        this.errorMsg = error.error.message;
        this.router.navigate(['/login'], {
          skipLocationChange: true,
          queryParams: { errMsg: error.error.message }
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

  filterTeamMatches(teamId) {
    this.spinnerService.show();
    this.matchDetailsService.getMatchDetailsForDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
      let filteredData ;
      if(teamId == 0) {
        filteredData = data;
      } else {
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
      }
      this.setMatchDetails(filteredData);
    });
  }

  filterAnniversaryMatches(anniversary) {
    this.spinnerService.show();
    if(anniversary == "0") {
      this.startDate = this.anniversaryOptions[0].startDate;
      this.endDate = this.anniversaryOptions[0].endDate;
    } else {
      this.startDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].startDate;
      this.endDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].endDate;
    }
    
    let filteredData;
    let teamId = this.teamDropdownElement.nativeElement.value;
    this.matchDetailsService.getMatchDetailsForDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
      if(teamId == 0) {
        filteredData = data;
      } else {
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
      }
      this.setMatchDetails(filteredData);
    });
  }

  filterRecords() {
    this.filterTeamMatches(this.teamDropdownElement.nativeElement.value);
  }

  getWinPercentageClass(percent: number): string {
    if (percent >= 60) {
      return '';
    } else if (percent >= 30) {
      return 'low';
    } else {
      return 'verylow';
    }
  }

  getWinColor(match: any): string {
    if (match.matchResult?.includes('WON')) {
      return '#2e7d32'; // green
    } else if (match.matchResult?.includes('LOST')) {
      return '#c62828'; // red
    }
    return '#000';
  }

  setMatchDetails(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return JSON.stringify(data).toLowerCase().includes(searchString);
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if(data) {
      let allData : MatchDetails[] = data;
      let wonData : MatchDetails[] = allData.filter(item =>
        item.matchResult == 'WON');

      this.played = allData.length;
      this.won = wonData.length;
      this.winPercentage = Math.floor((this.won / this.played) * 100);
      if(isNaN(this.winPercentage)) {
        this.winPercentage = 0;
      }
      

      this.batPlayed =  allData.filter(item =>
        item.batFirst == 'Y'
      ).length;
      this.batWon =  wonData.filter(item =>
        item.batFirst == 'Y'
      ).length;
      this.batWinPercentage = Math.floor((this.batWon / this.batPlayed) * 100);
      if(isNaN(this.batWinPercentage)) {
        this.batWinPercentage = 0;
      }
      

      this.bowlPlayed =  this.played - this.batPlayed;
      this.bowlWon =  this.won - this.batWon;
      this.bowlWinPercentage = Math.floor((this.bowlWon / this.bowlPlayed) * 100);
      if(isNaN(this.bowlWinPercentage)) {
        this.bowlWinPercentage = 0;
      }
      
    }
    if(0 == this.teamDropdownElement.nativeElement.value) {
      this.selectedTeamName = 'All';
    } else {
      this.selectedTeamName = this.teamOptions.filter(item =>
        item.teamId == this.teamDropdownElement.nativeElement.value
      )[0].teamName;
    }
    this.spinnerService.hide();
  }

  applyFilter(filterValue: string) { 
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddUpdateMatchDetailsModal(matchDetails: MatchDetails): void {
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '650px',
      height: '450px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: {
        addFlag: matchDetails.matchId !== undefined ? false : true,
        matchDetails: matchDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deleteMatchDetails(id: number) {
    this.matchDetailsService
      .deleteMatchDetails(id).subscribe(data => {
        console.log(data)
        this.reloadData();
      },
        error => {
          console.log(error);
          this.errorMsg = error.error.message;
        });
  }


}

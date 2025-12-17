import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BowlingDetailsService } from './bowling-details.service';
import { BowlingDetails } from './bowling-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './bowling-details-modal.component';
import { CalendarDetailsService } from '../calendar-details/calendar-details.service';
import { CalendarDetails } from '../calendar-details/calendar-details';
import { TeamDetailsService } from '../team-details/team-details.service';
import { TeamDetails } from '../team-details/team-details';
import { MatchDetails } from '../match-details/match-details';
import { MatchDetailsService } from '../match-details/match-details.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bowling-details-list',
  templateUrl: './bowling-details.component.html',
  styleUrls: ['./bowling-details.component.css']
})
export class BowlingDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<BowlingDetails>;  
  displayedColumns: string[] = ['playerName','overs','runs','maidens', 'fours','sixes','wickets','dots', 'wides','noballs','economy','action'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
  @ViewChild('team') teamDropdownElement!: ElementRef;
  @ViewChild('match') matchDropdownElement!: ElementRef;
  
  errorMsg: string;
  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  matchOptions: MatchDetails[];
  selectedTeam: number;
  selectedAnniversary: number;
  selectedMatch: number;
  
  constructor(
    private bowlingDetailsService: BowlingDetailsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    private matchDetailsService: MatchDetailsService,
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
      this.selectedTeam = this.teamOptions[0].teamId;
      this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
        this.anniversaryOptions = data;
        this.selectedAnniversary = this.anniversaryOptions[0].anniversary;
        this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
        this.matchDetailsService.getMatchDetailsForDates(moment(this.anniversaryOptions[0].startDate).format('YYYY-MM-DD'), moment(this.anniversaryOptions[0].endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.matchOptions = data.filter(item =>
            item.teamDetails.teamId == this.teamOptions[0].teamId
          );
          if(this.matchOptions.length > 0) {
            this.matchOptions.sort((a, b) => b.matchId - a.matchId);
            this.selectedMatch = this.matchOptions[0].matchId;
            this.bowlingDetailsService.getBowlingDetailsForMatch(this.matchOptions[0].matchId).subscribe(data =>{  
              this.setBowlingDetails(data);
            });
          } else {
            this.matchOptions = [];
            this.setBowlingDetails([]);
          }
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

  filterMatches(matchId) {
    this.spinnerService.show();
    this.selectedMatch = matchId;
    this.bowlingDetailsService.getBowlingDetailsForMatch(matchId).subscribe(data =>{  
      this.setBowlingDetails(data);
    });
  }

  filterTeamMatches(teamId) {
    this.spinnerService.show();
    this.calendarDetailsService.getCalendarDetails(this.anniversaryDropdownElement.nativeElement.value).subscribe(data => {
      this.matchDetailsService.getMatchDetailsForDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
        let filteredData ;
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
        if(filteredData.length > 0) {
          this.matchOptions = filteredData;
          this.matchOptions.sort((a, b) => b.matchId - a.matchId);
          this.selectedMatch = this.matchOptions[0].matchId;
          this.bowlingDetailsService.getBowlingDetailsForMatch(filteredData[0].matchId).subscribe(data =>{  
            this.setBowlingDetails(data);
          });
        } else {
          this.matchOptions = [];
          this.setBowlingDetails([]);
        }
      });
    });
  }

  filterAnniversaryMatches(anniversary) {
    this.spinnerService.show();
    let filteredData 
    let teamId = this.teamDropdownElement.nativeElement.value;
    this.calendarDetailsService.getCalendarDetails(anniversary).subscribe(data => {
      this.matchDetailsService.getMatchDetailsForDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
        if(filteredData.length > 0) {
          this.matchOptions = filteredData;
          this.matchOptions.sort((a, b) => b.matchId - a.matchId);
          this.selectedMatch = this.matchOptions[0].matchId;
          this.bowlingDetailsService.getBowlingDetailsForMatch(filteredData[0].matchId).subscribe(data =>{  
            this.setBowlingDetails(data);
          });
        } else {
          this.matchOptions = [];
          this.setBowlingDetails([]);
        }
      });
    });
  }

  setBowlingDetails(data) {
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

  openAddUpdateBowlingDetailsModal(bowlingDetails : BowlingDetails): void {
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '650px',
      height: '530px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        addFlag: bowlingDetails.id !== undefined ? false : true,
        bowlingDetails: bowlingDetails,
        selectedMatch: this.matchDropdownElement.nativeElement.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deleteBowlingDetails(id: number) {
    this.bowlingDetailsService
    .deleteBowlingDetails(id).subscribe(data => {
      console.log(data)
      this.reloadData();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

 
}

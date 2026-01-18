import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldingDetailsService } from './fielding-details.service';
import { FieldingDetails } from './fielding-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './fielding-details-modal.component';
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
  selector: 'app-fielding-details-list',
  templateUrl: './fielding-details.component.html',
  styleUrls: ['./fielding-details.component.css']
})
export class FieldingDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<FieldingDetails>;  
  displayedColumns: string[] = ['playerName','catches','catchesDropped','runOuts','runsSaved','runsMissed', 'action'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  
  errorMsg: string;
  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  matchOptions: MatchDetails[];
  selectedTeam: number;
  selectedAnniversary: number;
  selectedMatch: number;

  selectedTeamAddUpdate: number;
  selectedAnniversaryAddUpdate: number;
  selectedMatchAddUpdate: number;
  
  constructor(
    private fieldingDetailsService: FieldingDetailsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    private matchDetailsService: MatchDetailsService,
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
      this.selectedTeam = this.selectedTeamAddUpdate ? this.selectedTeamAddUpdate : this.teamOptions[0].teamId;
      this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
        this.anniversaryOptions = data;
        this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
        this.selectedAnniversary = this.selectedAnniversaryAddUpdate ? this.selectedAnniversaryAddUpdate : this.anniversaryOptions[0].anniversary;
        let anniversary = this.anniversaryOptions.filter(item =>
          item.anniversary == this.selectedAnniversary
        );
        this.matchDetailsService.getMatchDetailsForDates(moment(anniversary[0].startDate).format('YYYY-MM-DD'), moment(anniversary[0].endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.matchOptions = data.filter(item =>
            item.teamDetails.teamId == this.selectedTeam
          );
          if(this.matchOptions.length > 0) {
            this.matchOptions.sort((a, b) => b.matchId - a.matchId);
            this.selectedMatch = this.selectedMatchAddUpdate ? this.selectedMatchAddUpdate : this.matchOptions[0].matchId;
            this.fieldingDetailsService.getFieldingDetailsForMatch(this.selectedMatch).subscribe(data =>{  
              this.setFieldingDetails(data);
            });
          } else {
            this.matchOptions = [];
            this.setFieldingDetails([]);
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
    this.fieldingDetailsService.getFieldingDetailsForMatch(matchId).subscribe(data =>{  
      this.setFieldingDetails(data);
    });
  }

  filterTeamMatches(teamId) {
    this.spinnerService.show();
    this.calendarDetailsService.getCalendarDetails(this.selectedAnniversary).subscribe(data => {
      this.matchDetailsService.getMatchDetailsForDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
        let filteredData ;
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
        if(filteredData.length > 0) {
          this.matchOptions = filteredData;
          this.matchOptions.sort((a, b) => b.matchId - a.matchId);
          this.selectedMatch = this.matchOptions[0].matchId;
          this.fieldingDetailsService.getFieldingDetailsForMatch(filteredData[0].matchId).subscribe(data =>{  
            this.setFieldingDetails(data);
          });
        } else {
          this.matchOptions = [];
          this.setFieldingDetails([]);
        }
      });
    });
  }

  filterAnniversaryMatches(anniversary) {
    this.spinnerService.show();
    let filteredData 
    let teamId = this.selectedTeam;
    this.calendarDetailsService.getCalendarDetails(anniversary).subscribe(data => {
      this.matchDetailsService.getMatchDetailsForDates(moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')).subscribe(data => {
        filteredData = data.filter(item =>
          item.teamDetails.teamId == teamId
        );
        if(filteredData.length > 0) {
          this.matchOptions = filteredData;
          this.matchOptions.sort((a, b) => b.matchId - a.matchId);
          this.selectedMatch = this.matchOptions[0].matchId;
          this.fieldingDetailsService.getFieldingDetailsForMatch(filteredData[0].matchId).subscribe(data =>{  
            this.setFieldingDetails(data);
          });
        } else {
          this.matchOptions = [];
          this.setFieldingDetails([]);
        }
      });
    });
  }

  setFieldingDetails(data) {
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

  openAddUpdateFieldingDetailsModal(fieldingDetails : FieldingDetails): void {
    let isUpdate = fieldingDetails.id !== undefined;
    this.selectedTeamAddUpdate = this.selectedTeam;
    this.selectedAnniversaryAddUpdate = this.selectedAnniversary;
    this.selectedMatchAddUpdate = this.selectedMatch;
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '650px',
      height: '450px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        addFlag: !isUpdate,
        fieldingDetails: fieldingDetails,
        selectedMatch: this.selectedMatch
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deleteFieldingDetails(id: number) {
    this.selectedTeamAddUpdate = this.selectedTeam;
    this.selectedAnniversaryAddUpdate = this.selectedAnniversary;
    this.selectedMatchAddUpdate = this.selectedMatch;
    this.fieldingDetailsService
    .deleteFieldingDetails(id).subscribe(data => {
      console.log(data)
      this.reloadData();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

 
}

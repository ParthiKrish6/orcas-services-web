import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchDetails } from './match-details';
import { MatchDetailsService } from './match-details.service';
import { TeamDetailsService } from '../team-details/team-details.service';
import { TeamDetails } from '../team-details/team-details';

@Component({
  selector: 'app-modal',
  templateUrl: './match-details-modal.component.html',
  styleUrls: ['./match-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  matchDetails: MatchDetails;
  teamDetails: TeamDetails[];
  teamDetail: TeamDetails;
  addFlag: boolean;
  errorMsg: string;
  selectedValue: number;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private matchDetailsService: MatchDetailsService,
    private teamDetailsService: TeamDetailsService
  ) { 
  }

  ngOnInit() {
    this.matchDetails = this.data.matchDetails;
    if(this.matchDetails.teamDetails) {
      this.selectedValue = this.matchDetails.teamDetails.teamId;
      this.setTeam();
    }

    this.teamDetailsService.getTeamDetailsList().subscribe(data =>{  
      this.teamDetails = data;
    });
    this.addFlag = this.data.addFlag;
  }

  closeModal() {
    this.dialogRef.close();
  }

  setTeam() {
    this.teamDetailsService.getTeamDetails(this.selectedValue).subscribe(data =>{  
      this.teamDetail = data;
    });
  }

  addMatchDetails(addMatchObj: MatchDetails) {
    addMatchObj.teamDetails = this.teamDetail;
    this.matchDetailsService
    .addMatchDetails(addMatchObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateMatchDetails(id: number, updateMatchObj: MatchDetails) {
    updateMatchObj.teamDetails = this.teamDetail;
    this.matchDetailsService
    .updateMatchDetails(id, updateMatchObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  gotoList() {
    this.dialogRef.close();
  }

}
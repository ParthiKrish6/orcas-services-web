import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchDetails } from './match-details';
import { MatchDetailsService } from './match-details.service';
import { TeamDetailsService } from '../team-details/team-details.service';
import { TeamDetails } from '../team-details/team-details';
import { PlayerDetailsService } from '../player-details/player-details.service';

@Component({
  selector: 'app-modal',
  templateUrl: './match-details-modal.component.html',
  styleUrls: ['./match-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  matchDetails: MatchDetails;
  teamDetails: TeamDetails[];
  teamDetail: TeamDetails;
  playerDetails: TeamDetails;
  addFlag: boolean;
  errorMsg: string;
  selectedValue: number;
  selectedCaptain: string;
  selectedViceCaptain: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private matchDetailsService: MatchDetailsService,
    private teamDetailsService: TeamDetailsService,
    private playerDetailsService: PlayerDetailsService
  ) { 
  }

  ngOnInit() {
    this.matchDetails = this.data.matchDetails;
    if(this.matchDetails.teamDetails) {
      this.selectedValue = this.matchDetails.teamDetails.teamId;
      this.setTeam();
    }

    this.selectedCaptain = this.matchDetails.captain;
    this.selectedViceCaptain = this.matchDetails.viceCaptain;

    this.teamDetailsService.getTeamDetailsList().subscribe(data =>{  
      this.teamDetails = data;
    });
    this.playerDetailsService.getPlayerDetailsList().subscribe(data =>{  
      this.playerDetails = data;
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
    addMatchObj.captain = this.selectedCaptain;
    addMatchObj.viceCaptain = this.selectedViceCaptain;
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
    updateMatchObj.captain = this.selectedCaptain;
    updateMatchObj.viceCaptain = this.selectedViceCaptain
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
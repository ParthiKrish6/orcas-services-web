import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldingDetails } from './fielding-details';
import { FieldingDetailsService } from './fielding-details.service';
import { PlayerDetailsService } from '../player-details/player-details.service';
import { PlayerDetails } from '../player-details/player-details';
import { MatchDetailsService } from '../match-details/match-details.service';
import { MatchDetails } from '../match-details/match-details';

@Component({
  selector: 'app-modal',
  templateUrl: './fielding-details-modal.component.html',
  styleUrls: ['./fielding-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  fieldingDetails: FieldingDetails;
  addFlag: boolean;
  errorMsg: string;
  selectedValue: number;
  selectedMatch: number;
  playerDetails: PlayerDetails[];
  playerDetail: PlayerDetails;
  matchDetail: MatchDetails;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldingDetailsService: FieldingDetailsService,
    private playerDetailsService: PlayerDetailsService,
    private matchDetailsService: MatchDetailsService
  ) { 
  }

  ngOnInit() {
    this.fieldingDetails = this.data.fieldingDetails;

    if(this.fieldingDetails.playerDetails) {
      this.selectedValue = this.fieldingDetails.playerDetails.playerId;
      this.setPlayer();
    } 

    if(this.fieldingDetails.matchDetails) {
      this.selectedMatch = this.fieldingDetails.matchDetails.matchId;
      this.setMatch();
    } else {
      this.selectedMatch = this.data.selectedMatch;
      this.setMatch();
    }
    
    this.playerDetailsService.getPlayerDetailsList().subscribe(data =>{  
      this.playerDetails = data;
    });

    this.addFlag = this.data.addFlag;

    if(this.addFlag) {
      this.fieldingDetails.catches = '0';
      this.fieldingDetails.runOuts = '0';
      this.fieldingDetails.runsMissed = '0';
      this.fieldingDetails.runsSaved = '0';
      this.fieldingDetails.catchesDropped = '0';
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  setPlayer() {
    this.playerDetailsService.getPlayerDetails(this.selectedValue).subscribe(data =>{  
      this.playerDetail = data;
    });
  }

  setMatch() {
    this.matchDetailsService.getMatchDetails(this.selectedMatch).subscribe(data =>{  
      this.matchDetail = data;
    });
  }

  addFieldingDetails(addFieldingObj: FieldingDetails) {
    addFieldingObj.matchDetails = this.matchDetail;
    addFieldingObj.playerDetails = this.playerDetail;
    this.fieldingDetailsService
    .addFieldingDetails(addFieldingObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateFieldingDetails(id: number, updateFieldingObj: FieldingDetails) {
    updateFieldingObj.playerDetails = this.playerDetail;
    this.fieldingDetailsService
    .updateFieldingDetails(id, updateFieldingObj).subscribe(data => {
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
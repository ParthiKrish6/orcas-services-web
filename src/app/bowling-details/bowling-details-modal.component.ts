import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BowlingDetails } from './bowling-details';
import { BowlingDetailsService } from './bowling-details.service';
import { PlayerDetailsService } from '../player-details/player-details.service';
import { PlayerDetails } from '../player-details/player-details';
import { MatchDetails } from '../match-details/match-details';
import { MatchDetailsService } from '../match-details/match-details.service';

@Component({
  selector: 'app-modal',
  templateUrl: './bowling-details-modal.component.html',
  styleUrls: ['./bowling-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  bowlingDetails: BowlingDetails;
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
    private bowlingDetailsService: BowlingDetailsService,
    private playerDetailsService: PlayerDetailsService,
    private matchDetailsService: MatchDetailsService
  ) { 
  }

  ngOnInit() {
    this.bowlingDetails = this.data.bowlingDetails;

    if(this.bowlingDetails.playerDetails) {
      this.selectedValue = this.bowlingDetails.playerDetails.playerId;
      this.setPlayer();
    } 

    if(this.bowlingDetails.matchDetails) {
      this.selectedMatch = this.bowlingDetails.matchDetails.matchId;
      this.setMatch();
    } else {
      this.selectedMatch = this.data.selectedMatch;
      this.setMatch();
    }

    this.playerDetailsService.getPlayerDetailsList().subscribe(data =>{  
      this.playerDetails = data;
    });
    this.addFlag = this.data.addFlag;
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

  addBowlingDetails(addBowlingObj: BowlingDetails) {
    addBowlingObj.playerDetails = this.playerDetail;
    addBowlingObj.matchDetails = this.matchDetail;
    this.bowlingDetailsService
    .addBowlingDetails(addBowlingObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateBowlingDetails(id: number, updateBowlingObj: BowlingDetails) {
    updateBowlingObj.playerDetails = this.playerDetail;
    this.bowlingDetailsService
    .updateBowlingDetails(id, updateBowlingObj).subscribe(data => {
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
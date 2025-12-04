import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BattingDetails } from './batting-details';
import { BattingDetailsService } from './batting-details.service';
import { PlayerDetailsService } from '../player-details/player-details.service';
import { PlayerDetails } from '../player-details/player-details';
import { MatchDetailsService } from '../match-details/match-details.service';
import { MatchDetails } from '../match-details/match-details';

@Component({
  selector: 'app-modal',
  templateUrl: './batting-details-modal.component.html',
  styleUrls: ['./batting-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  battingDetails: BattingDetails;
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
    private battingDetailsService: BattingDetailsService,
    private playerDetailsService: PlayerDetailsService,
    private matchDetailsService: MatchDetailsService
  ) { 
  }

  ngOnInit() {
    this.battingDetails = this.data.battingDetails;

    if(this.battingDetails.playerDetails) {
      this.selectedValue = this.battingDetails.playerDetails.playerId;
      this.setPlayer();
    } 

    if(this.battingDetails.matchDetails) {
      this.selectedMatch = this.battingDetails.matchDetails.matchId;
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

  addBattingDetails(addBattingObj: BattingDetails) {
    addBattingObj.playerDetails = this.playerDetail;
    addBattingObj.matchDetails = this.matchDetail;
    this.battingDetailsService
    .addBattingDetails(addBattingObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateBattingDetails(id: number, updateBattingObj: BattingDetails) {
    updateBattingObj.playerDetails = this.playerDetail;
    this.battingDetailsService
    .updateBattingDetails(id, updateBattingObj).subscribe(data => {
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
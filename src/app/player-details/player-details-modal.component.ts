import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayerDetails } from './player-details';
import { PlayerDetailsService } from './player-details.service';

@Component({
  selector: 'app-modal',
  templateUrl: './player-details-modal.component.html',
  styleUrls: ['./player-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  playerDetails: PlayerDetails;
  addFlag: boolean;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private playerDetailsService: PlayerDetailsService
  ) { 
  }

  ngOnInit() {
    this.playerDetails = this.data.playerDetails;
    this.addFlag = this.data.addFlag;
  }

  closeModal() {
    this.dialogRef.close();
  }

  addPlayerDetails(addPlayerObj: PlayerDetails) {
    this.playerDetailsService
    .addPlayerDetails(addPlayerObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updatePlayerDetails(id: number, updatePlayerObj: PlayerDetails) {
    this.playerDetailsService
    .updatePlayerDetails(id, updatePlayerObj).subscribe(data => {
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
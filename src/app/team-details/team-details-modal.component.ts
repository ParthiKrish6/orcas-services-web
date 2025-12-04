import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamDetails } from './team-details';
import { TeamDetailsService } from './team-details.service';

@Component({
  selector: 'app-modal',
  templateUrl: './team-details-modal.component.html',
  styleUrls: ['./team-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  teamDetails: TeamDetails;
  addFlag: boolean;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private teamDetailsService: TeamDetailsService
  ) { 
  }

  ngOnInit() {
    this.teamDetails = this.data.teamDetails;
    this.addFlag = this.data.addFlag;
  }

  closeModal() {
    this.dialogRef.close();
  }

  addTeamDetails(addTeamObj: TeamDetails) {
    this.teamDetailsService
    .addTeamDetails(addTeamObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateTeamDetails(id: number, updateTeamObj: TeamDetails) {
    this.teamDetailsService
    .updateTeamDetails(id, updateTeamObj).subscribe(data => {
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
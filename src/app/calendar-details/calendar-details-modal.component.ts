import { Component, OnInit, Optional, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarDetails } from './calendar-details';
import { CalendarDetailsService } from './calendar-details.service';

@Component({
  selector: 'app-modal',
  templateUrl: './calendar-details-modal.component.html',
  styleUrls: ['./calendar-details-modal.component.css']
})

export class ModalComponent implements OnInit {

  calendarDetails: CalendarDetails;
  addFlag: boolean;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarDetailsService: CalendarDetailsService
  ) { 
  }

  ngOnInit() {
    this.calendarDetails = this.data.calendarDetails;
    this.addFlag = this.data.addFlag;
  }

  closeModal() {
    this.dialogRef.close();
  }

  addCalendarDetails(addCalendarObj: CalendarDetails) {
    this.calendarDetailsService
    .addCalendarDetails(addCalendarObj).subscribe(data => {
      console.log(data)
      this.gotoList();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

  updateCalendarDetails(id: number, updateCalendarObj: CalendarDetails) {
    this.calendarDetailsService
    .updateCalendarDetails(id, updateCalendarObj).subscribe(data => {
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
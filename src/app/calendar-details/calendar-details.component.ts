import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalendarDetailsService } from './calendar-details.service';
import { CalendarDetails } from './calendar-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './calendar-details-modal.component';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-calendar-details-list',
  templateUrl: './calendar-details.component.html',
  styleUrls: ['./calendar-details.component.css']
})
export class CalendarDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<CalendarDetails>;  
  displayedColumns: string[] = ['anniversary', 'startDate', 'endDate', 'action'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  
  myForm:FormGroup; 
  errorMsg: string;

  constructor(
    private calendarDetailsService: CalendarDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.spinnerService.show();
    this.calendarDetailsService
    .getCalendarDetailsList().subscribe(data => {
      this.setCalendarDetails(data);
    }, 
    error => {
      this.router.navigate(['/login'],{
        queryParams: {
          skipLocationChange: true,
          errMsg: error.error.message
        },
      }); 
    });
    
  }

  setCalendarDetails(data) {
    this.dataSource = new MatTableDataSource(data);  
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

  openAddUpdateCalendarDetailsModal(calendarDetails : CalendarDetails): void {
    let flag = calendarDetails.anniversary !== undefined ? false : true;
    let height = flag ? '450px' : '450px';
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '500px',
      height: height,
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        addFlag: flag ,
        calendarDetails: calendarDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deleteCalendarDetails(id: number) {
    this.calendarDetailsService
    .deleteCalendarDetails(id).subscribe(data => {
      console.log(data)
      this.reloadData();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

 
}

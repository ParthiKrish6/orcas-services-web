import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TeamDetailsService } from './team-details.service';
import { TeamDetails } from './team-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './team-details-modal.component';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-team-details-list',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<TeamDetails>;  
  displayedColumns: string[] = ['teamId', 'teamName', 'action'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  
  myForm:FormGroup; 
  errorMsg: string;

  constructor(
    private teamDetailsService: TeamDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.spinnerService.show();
    this.teamDetailsService
    .getTeamDetailsList().subscribe(data => {
      console.log(data)
      this.setTeamDetails(data);
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

  setTeamDetails(data) {
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

  openAddUpdateTeamDetailsModal(teamDetails : TeamDetails): void {
    let flag = teamDetails.teamId !== undefined ? false : true;
    let height = flag ? '290px' : '370px';
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '500px',
      height: height,
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        addFlag: flag,
        teamDetails: teamDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deleteTeamDetails(id: number) {
    this.teamDetailsService
    .deleteTeamDetails(id).subscribe(data => {
      console.log(data)
      this.reloadData();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

 
}

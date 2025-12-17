import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerDetailsService } from './player-details.service';
import { PlayerDetails } from './player-details';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalComponent } from './player-details-modal.component';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-player-details-list',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<PlayerDetails>;  
  displayedColumns: string[] = ['playerId', 'playerName', 'nickName', 'image', 'action'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort; 
  
  myForm:FormGroup; 
  errorMsg: string;

  constructor(
    private playerDetailsService: PlayerDetailsService,
    public matDialog: MatDialog,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.spinnerService.show();
    this.playerDetailsService.getPlayerDetailsList().subscribe(data =>{  
      this.setPlayerDetails(data);
    },error => {
      console.log(error);
      this.errorMsg = error.error.message;
      this.router.navigate(['/login'], {
        skipLocationChange: true,
        queryParams: { errMsg: error.error.message }
      });
    });
  }

  setPlayerDetails(data) {
    data.forEach(item => {
      item.image = "assets/player_images/"+item.playerId+".png";
    });
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

  openAddUpdatePlayerDetailsModal(playerDetails : PlayerDetails): void {
    let flag = playerDetails.playerId !== undefined ? false : true;
    let height = flag ? '370px' : '450px';
    const dialogRef = this.matDialog.open(ModalComponent, {
      disableClose: true,
      width: '600px',
      height: height,
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        addFlag: flag,
        playerDetails: playerDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  deletePlayerDetails(id: number) {
    this.playerDetailsService
    .deletePlayerDetails(id).subscribe(data => {
      console.log(data)
      this.reloadData();
    }, 
    error => {
      console.log(error);
      this.errorMsg = error.error.message;
    });
  }

 
}

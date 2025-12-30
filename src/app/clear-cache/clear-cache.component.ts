import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { ClearCacheService } from './clear-cache.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-clear-cache',
    animations: [routerTransition()]
})
export class ClearCacheComponent implements OnInit {

  
    constructor(public router: Router, private route: ActivatedRoute,
        private clearCacheService: ClearCacheService,private spinnerService: NgxSpinnerService) {
       
    }

    ngOnInit() {
        this.clearCache();
    }

    clearCache() {
        this.spinnerService.show();
        this.clearCacheService.clearCache().subscribe(
            (response) => {
                alert(response);
                this.spinnerService.hide();
                this.router.navigate(['/dashboard'],{ skipLocationChange: true }); 
            },
            (error) => {
                alert(error);
                this.spinnerService.hide();
                this.router.navigate(['/dashboard'],{ skipLocationChange: true }); 
            }
        );
    }

}

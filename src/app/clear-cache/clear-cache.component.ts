import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { ClearCacheService } from './clear-cache.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-clear-cache',
    templateUrl: './clear-cache.component.html',
    styleUrls: ['./clear-cache.component.css']
})
export class ClearCacheComponent implements OnInit {

    clearCacheSuccess: boolean = false;
    clearCacheError: boolean = false;
    errorMessage: string = '';

    constructor(public router: Router, 
        private clearCacheService: ClearCacheService,
        private spinnerService: NgxSpinnerService) {
    }

    ngOnInit() {
       
    }

    clearCache() {
        this.spinnerService.show();
        this.clearCacheService.clearCache().subscribe(
            (response) => {
                console.log(response);
                this.clearCacheSuccess = true;
                this.clearCacheError = false;
                this.spinnerService.hide();
            },
            (error) => {
                console.log(error);
                this.clearCacheError = true;
                if(error.error) {
                    this.errorMessage = error.error.message;
                } else {
                    this.errorMessage = error.message || 'An unknown error occurred during upload.';
                }
                this.spinnerService.hide();
            }
        );
    }

}

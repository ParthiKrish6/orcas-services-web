import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { LoginDetails } from './login-details';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    myForm: FormGroup;
    loginDet: LoginDetails;

    constructor(public router: Router, private route: ActivatedRoute,private fb: FormBuilder,
        private loginService: LoginService,private spinnerService: NgxSpinnerService) {
        this.myForm = this.fb.group({
            user: ['', Validators.required],
            pwd: ['', Validators.required],
          });
    }

    errorMsg: string;

    ngOnInit() {
        localStorage.clear();
        this.errorMsg = this.route.snapshot.queryParamMap.get('errMsg');
        this.spinnerService.hide();
    }

    onLoggedin() {
        this.spinnerService.show();
        this.loginDet = new LoginDetails();
        this.loginDet.userId = this.myForm.get('user')?.value;
        this.loginDet.pwd = this.generateSha512Hash(this.myForm.get('pwd')?.value);
        
        this.loginService.login(this.loginDet).subscribe(
            (response) => {
                let loginResp : any = response;
                if(loginResp && loginResp.userId && loginResp.pwd && loginResp.type && loginResp.token) {
                    localStorage.setItem('authToken', loginResp.token);
                    localStorage.setItem('authType', loginResp.type);
                    this.router.navigate(['/dashboard'],{ skipLocationChange: true }); 
                } else {
                    localStorage.clear();
                    this.errorMsg =  'Incorrect Login';
                    this.spinnerService.hide();
                }
            },
            (error) => {
                localStorage.clear();
                this.errorMsg =  'Login Failed.', error;
                this.spinnerService.hide();
            }
          );
    }

    generateSha512Hash(data: string): string {
        return CryptoJS.SHA512(data).toString(CryptoJS.enc.Base64);
    }
}

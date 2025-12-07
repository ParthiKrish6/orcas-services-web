import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { LoginDetails } from './login-details';

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
        private loginService: LoginService) {
        this.myForm = this.fb.group({
            user: ['', Validators.required],
            pwd: ['', Validators.required],
          });
    }

    errorMsg: string;

    ngOnInit() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authType');
        this.errorMsg = this.route.snapshot.queryParamMap.get('errMsg');
    }

    onLoggedin() {
        this.loginDet = new LoginDetails();
        this.loginDet.userId = this.myForm.get('user')?.value;
        this.loginDet.pwd = this.generateSha512Hash(this.myForm.get('pwd')?.value);
        this.loginService.login(this.loginDet).subscribe(data => {
           let loginResp : any = data;
           if(loginResp && loginResp.userId && loginResp.pwd && loginResp.type) {
                localStorage.setItem('authToken', 'Y');
                localStorage.setItem('authType', loginResp.type);
                this.router.navigate(['/dashboard']); 
           } else {
                this.errorMsg =  'Incorrect Login';
           }
        });
    }

    generateSha512Hash(data: string): string {
        return CryptoJS.SHA512(data).toString(CryptoJS.enc.Base64);
    }
}

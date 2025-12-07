import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule, NgxSpinnerModule],
    declarations: [LoginComponent], 
})
export class LoginModule {}

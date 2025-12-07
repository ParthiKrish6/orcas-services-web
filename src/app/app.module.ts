import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule, Keepalive } from '@ng-idle/keepalive';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NgIdleModule,
        NgIdleKeepaliveModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        Keepalive 
    ],
})
export class AppModule {}

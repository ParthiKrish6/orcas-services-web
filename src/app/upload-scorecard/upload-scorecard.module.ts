import {NgModule} from '@angular/core';  
import { CommonModule } from '@angular/common';
import { UploadScoreCardRoutingModule } from './upload-scorecard-routing.module';
import { UploadScoreCardComponent } from './upload-scorecard.component';

const modules = [
    CommonModule, 
    UploadScoreCardRoutingModule
];

@NgModule({
  imports: modules, 
  exports: modules, 
  declarations : [
    UploadScoreCardComponent,
  ]
})  
export class UploadScoreCardModule { }  

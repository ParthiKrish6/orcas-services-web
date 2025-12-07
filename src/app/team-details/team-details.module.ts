import {A11yModule} from '@angular/cdk/a11y';  
import {DragDropModule} from '@angular/cdk/drag-drop';  
import {PortalModule} from '@angular/cdk/portal';  
import {ScrollingModule} from '@angular/cdk/scrolling';  
import {CdkStepperModule} from '@angular/cdk/stepper';  
import {CdkTableModule} from '@angular/cdk/table';  
import {CdkTreeModule} from '@angular/cdk/tree';  
import {NgModule} from '@angular/core';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  
  MatAutocompleteModule,  
  MatBadgeModule,  
  MatBottomSheetModule,  
  MatButtonModule,  
  MatButtonToggleModule,  
  MatCardModule,  
  MatCheckboxModule,  
  MatChipsModule,  
  MatDatepickerModule,  
  MatDialogModule,  
  MatDividerModule,  
  MatExpansionModule,  
  MatGridListModule,  
  MatIconModule,  
  MatInputModule,  
  MatListModule,  
  MatMenuModule,  
  MatNativeDateModule,  
  MatPaginatorModule,  
  MatProgressBarModule,  
  MatProgressSpinnerModule,  
  MatRadioModule,  
  MatRippleModule,  
  MatSelectModule,  
  MatSidenavModule,  
  MatSliderModule,  
  MatSlideToggleModule,  
  MatSnackBarModule,  
  MatSortModule,  
  MatStepperModule,  
  MatTableModule,  
  MatTabsModule,  
  MatToolbarModule,  
  MatTooltipModule,  
  MatTreeModule,  
} from '@angular/material';  
import { CommonModule } from '@angular/common';
import { TeamDetailsRoutingModule } from './team-details-routing.module';
import { TeamDetailsComponent } from './team-details.component';
import { ModalComponent as ModalComponent } from './team-details-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
  
const modules = [
  CommonModule, 
  TeamDetailsRoutingModule,
  A11yModule,  
  CdkStepperModule,  
  CdkTableModule,  
  CdkTreeModule,  
  DragDropModule,  
  MatAutocompleteModule,  
  MatBadgeModule,  
  MatBottomSheetModule,  
  MatButtonModule,  
  MatButtonToggleModule,  
  MatCardModule,  
  MatCheckboxModule,  
  MatChipsModule,  
  MatStepperModule,  
  MatDatepickerModule,  
  MatDialogModule,  
  MatDividerModule,  
  MatExpansionModule,  
  MatGridListModule,  
  MatIconModule,  
  MatInputModule,  
  MatListModule,  
  MatMenuModule,  
  MatNativeDateModule,  
  MatPaginatorModule,  
  MatProgressBarModule,  
  MatProgressSpinnerModule,  
  MatRadioModule,  
  MatRippleModule,  
  MatSelectModule,  
  MatSidenavModule,  
  MatSliderModule,  
  MatSlideToggleModule,  
  MatSnackBarModule,  
  MatSortModule,  
  MatTableModule,  
  MatTabsModule,  
  MatToolbarModule,  
  MatTooltipModule,  
  MatTreeModule,  
  PortalModule,  
  ScrollingModule,  
  FormsModule,
  ReactiveFormsModule,
  NgxSpinnerModule
];

@NgModule({
imports: modules, 
exports: modules, 
  declarations : [
    TeamDetailsComponent,
    ModalComponent
  ],
  entryComponents: [ModalComponent]
})  
export class TeamDetailsModule { }  

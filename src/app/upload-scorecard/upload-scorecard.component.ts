import { Component } from '@angular/core';
import { UploadScoreCardService } from './upload-scorecard.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload-scorecard',
  templateUrl: './upload-scorecard.component.html',
  styleUrls: ['./upload-scorecard.component.css']
})
export class UploadScoreCardComponent {

  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  errorMessage: string = '';
  
  constructor(private uploadScoreCardService: UploadScoreCardService,
    private spinnerService: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadSuccess = false; // Reset success message on new file selection
      this.uploadError = false; // Reset error message
    }
  }

  uploadFile(): void {
    this.spinnerService.show();
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.uploadScoreCardService.uploadScoreCard(formData)
        .subscribe(
          data => {
            console.log(data);
            this.uploadSuccess = true;
            this.uploadError = false;
            this.selectedFile = null;
            this.spinnerService.hide();
          },
          error => {
            console.log(error);
            this.uploadError = true;
            if(error.error) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = error.message || 'An unknown error occurred during upload.';
            }
            this.uploadSuccess = false;
            this.spinnerService.hide();
          });
    }
  }

}

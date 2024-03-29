import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';
import { Router, RouterOutlet } from '@angular/router';

import {MatSnackBar} from '@angular/material/snack-bar'; 
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import {formatDate} from '../../utils';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-flightdetails',
  standalone: true,
  imports: [
    SharedModule,
    RouterOutlet,
    HttpClientModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './flightdetails.component.html',
  styleUrl: './flightdetails.component.css'
})
export class FlightdetailsComponent {

  flightForm: FormGroup;
  ngxTimepicker: NgxMaterialTimepickerComponent
  minDate: Date;
  @ViewChild('formDirective') formDirective: FormGroupDirective;


  airlines: string[] = [
    'Alaska',
    'Allegiant',
    'American',
    'Delta',
    'Frontier',
    'Hawaiian',
    'JetBlue',
    'Southwest',
    'Spirit',
    'United'
  ]

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient, private router: Router) {
    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      flightNumber: ['', Validators.required],
      numOfGuests: [0, [Validators.required, Validators.min(1)]],
      comments: ['']
    });
    
    this.minDate = new Date();
  }

  ngOnInit(): void {
  }


  onSubmit(): void {
    if(this.flightForm.invalid){
      console.log(this.flightForm);
      return;
    }

    const formData = this.flightForm.value;
    const details = {...formData, arrivalDate: formatDate(formData?.arrivalDate)}
    
    this.http.post(environment.apiEndPoint, details).subscribe(
      (response: any) => {
        if (response == true) {
          this.snackBar.open('Details submitted successfully', '', { duration: 3000, horizontalPosition: 'center', verticalPosition:'top', panelClass:['success'] },);
          this.flightForm.reset();
          this.formDirective.resetForm();
        } else {
          this.snackBar.open('Error submitting flight details', '', { duration: 3000, horizontalPosition: 'center', verticalPosition:'top', panelClass:['failed'] });
          this.flightForm.reset();
          this.formDirective.resetForm();
        }
      },
      (error: any) => {
        this.snackBar.open('Error submitting flight details', '', { duration: 3000,horizontalPosition: 'center', verticalPosition:'top' });
        this.flightForm.reset();
        this.formDirective.resetForm();
      }
    );
  }
}

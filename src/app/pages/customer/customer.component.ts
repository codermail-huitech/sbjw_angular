import { Component, OnInit } from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../models/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {Observable} from 'rxjs';
import {AuthResponseData} from '../../services/auth.service';
import Swal from 'sweetalert2';

// @ts-ignore
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[];
  customer: Customer;
  currentEerror: {status: number, message: string, statusText: string};
  showDeveloperDiv = true;

  constructor(public customerService: CustomerService, private http: HttpClient, private _snackBar: MatSnackBar) {
    this.showDeveloperDiv = false;

  }

  onCustomerInsert(){
    this.http.post('https://angular-test-db-67686.firebaseio.com/customers.json',
      {name: 'Sandip Dhara', address: 'Barrackpore Shibtala', phone: '5236458905'})
      .subscribe((response) => {
      });
  }

  ngOnInit(): void {

     // this.customers = this.customerService.getCustomers();
     this.customerForm = this.customerService.customerForm;
     this.customerService.getCustomerUpdateListener().subscribe((response)=>{
       this.customers = response;

     });
  }

  onSubmit() {
    this.customerService.saveCustomer(this.customerForm.value).subscribe((response: {success: number, data: Customer}) => {
      if (response.data){
        console.log(response.data);
        Swal.fire(
          'Done!',
          'Customer Added',
          'success'
        );
        // this.customers.unshift(response.data);
      }
    });
  }

  myCustomValidation(control: FormControl): {[s: string]: boolean } {
      return {customError: true};
  }

  fillFormForUpdate($event){
    this.customerForm.setValue($event);
  }

  clearCustomerForm() {
    this.customerForm.reset();
  }

  // this function will update the customer
  updateCustomer() {
    let updateObserable = new Observable<any>();
    console.log(this.customerForm.value);
    updateObserable = this.customerService.updateCustomer(this.customerForm.value);


    updateObserable.subscribe((response) => {
      if (response.success === 1){
        Swal.fire(
          'Done!',
          'Customer Updated',
          'success'
        );
      }
      this.currentEerror = null;
    }, (error) => {
      this.currentEerror = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }
}

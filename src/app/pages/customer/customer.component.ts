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
    console.log('Customer Component calls');
    this.showDeveloperDiv = false;
  }

  onCustomerInsert(){
    // this.customerService.setData({id: 1061, name: 'Sujata Barai Station Para', address: 'Station Para', phone: '9232458905'});
    // tslint:disable-next-line:max-line-length
    this.http.post('https://angular-test-db-67686.firebaseio.com/customers.json',
      {name: 'Sandip Dhara', address: 'Barrackpore Shibtala', phone: '5236458905'})
      .subscribe((response) => {
      });
  }

  ngOnInit(): void {
     // this.customers = this.customerService.getCustomers();
     this.customerForm = this.customerService.customerForm;
     // this.customerService.getCustomerUpdateListener();
  }

  onGetCustomers() {
    // tslint:disable-next-line:no-unused-expression
  }

  onSubmit() {
    console.log(this.customerForm.value);
    this.customerService.saveCustomer(this.customerForm.value).subscribe((response: {success: number, data: Customer}) => {
      if (response.data){
        Swal.fire(
          'Done!',
          'Customer Added',
          'success'
        );
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
    updateObserable = this.customerService.updateCustomer(this.customerForm.value);


    updateObserable.subscribe((response) => {
      if (response.success === 1){
        Swal.fire(
          'Done!',
          'Customer Updated',
          'success'
        );
        // this._snackBar.openFromComponent(SncakBarComponent, {
        //   duration: 4000, data: {message: 'Hello World!'}
        // });
      }
      this.currentEerror = null;
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this.currentEerror = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });

  }
}

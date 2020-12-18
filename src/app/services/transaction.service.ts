import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Stock} from '../models/stock.model';
import {TransactionType} from '../models/transactionType.model';
import {Subject, throwError} from 'rxjs';
import {formatDate} from '@angular/common';
import {catchError, tap} from 'rxjs/operators';
import {JobMaster} from '../models/jobMaster.model';
import {JobResponseData} from './job.service';
import {User} from '../models/user.model';
import {Agent} from '../models/agent.model';
import {Material} from '../models/material.model';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  transactionForm: FormGroup;
  transactionTypeData: TransactionType[];
  employeeData: User[];
  materialData: Material[] = [];

  private transactionTypeSub = new Subject<TransactionType[]>();
  private employeeDataSub = new Subject<User[]>();
  private materialDataSub = new Subject<Material[]>();

  getTransactionTypeUpdateListener(){
    return this.transactionTypeSub.asObservable();
  }
  getEmployeeDataUpdateListener(){
    return this.employeeDataSub.asObservable();
  }
  getMaterialDataUpdateListener(){
    return this.materialDataSub.asObservable();
  }

  constructor(private http: HttpClient) {
    const received_date = new Date();
    const received_date_format = formatDate(received_date, 'yyyy-MM-dd', 'en');
    this.transactionForm = new FormGroup({
      id : new FormControl(null),
      transaction_id : new FormControl(null, [Validators.required]),
      employee_id : new FormControl(null, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      transaction_comment : new FormControl(null, [Validators.required]),
      received_date : new FormControl(received_date_format, [Validators.required])
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getTransactionType').subscribe((response: {success: number, data: TransactionType[]}) => {
      this.transactionTypeData = response.data;
      this.transactionTypeSub.next([...this.transactionTypeData]);
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getEmployees').subscribe((response: {success: number, data: User[]}) => {
      this.employeeData = response.data;
      this.employeeDataSub.next([...this.employeeData]);
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/materials').subscribe((response: {success: number, data: Material[]}) => {
      this.materialData = response.data;
      this.materialDataSub.next([...this.materialData]);
    });
  }

  saveTransaction(master, details){
    // this.transactionForm.value = data;
    console.log('service');
    console.log(this.transactionForm.value);
    // return;

    // return this.http.post(GlobalVariable.BASE_API_URL + '/saveTransaction',  this.transactionForm.value);
    return this.http.post(GlobalVariable.BASE_API_URL + '/saveTransaction',  {materialTransactionMaster: master, materialTransactionDetails: details});
  }

  private _serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'You are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
}

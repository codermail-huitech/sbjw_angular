import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Stock} from '../models/stock.model';
import {TransactionType} from '../models/transactionType.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  transactionForm: FormGroup;
  transactionTypeData: TransactionType[];

  private transactionTypeSub = new Subject<TransactionType[]>();

  getTransactionTypeUpdateListener(){
    return this.transactionTypeSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.transactionForm = new FormGroup({
      id : new FormControl(null),
      transaction_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      amount : new FormControl(null, [Validators.required]),
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getTransactionType').subscribe((response: {success: number, data: TransactionType[]}) => {
      this.transactionTypeData = response.data;
      this.transactionTypeSub.next([...this.transactionTypeData]);
    });
  }
}

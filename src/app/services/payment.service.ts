import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AgentResponseData} from './agent.service';
import {GlobalVariable} from '../shared/global';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  cashPaymentForm: FormGroup;
  goldPaymentForm: FormGroup;

  constructor(private http: HttpClient) {
    const received_date = new Date();
    const received_date_format = formatDate(received_date, 'yyyy-MM-dd', 'en');
    this.cashPaymentForm = new FormGroup({
      id : new FormControl(null),
      person_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      user_id : new FormControl(0, [Validators.required]),
      payment_mode : new FormControl(null, [Validators.required]),
      cash_received : new FormControl(null, [Validators.required]),
      received_date : new FormControl(received_date_format, [Validators.required]),
    });
    this.goldPaymentForm = new FormGroup({
      id : new FormControl(null),
      person_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      user_id : new FormControl(0, [Validators.required]),
      gold_received : new FormControl(null, [Validators.required]),
      received_date : new FormControl(received_date_format, [Validators.required]),
    });
  }

  saveCashPayment(){
    return this.http.post<AgentResponseData>(GlobalVariable.BASE_API_URL + '/saveCashPayment', this.cashPaymentForm.value);
  }

  saveGoldPayment(){
    return this.http.post<AgentResponseData>(GlobalVariable.BASE_API_URL + '/saveGoldPayment', this.goldPaymentForm.value);
  }
}

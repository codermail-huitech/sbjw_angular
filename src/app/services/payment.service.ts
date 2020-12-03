import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AgentResponseData} from './agent.service';
import {GlobalVariable} from '../shared/global';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  cashPaymentForm: FormGroup;
  goldPaymentForm: FormGroup;

  constructor(private http: HttpClient) {
    this.cashPaymentForm = new FormGroup({
      id : new FormControl(null),
      person_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      cash_received : new FormControl(0.00, [Validators.required])
    });
    this.goldPaymentForm = new FormGroup({
      id : new FormControl(null),
      person_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      gold_received : new FormControl(0.00, [Validators.required])
    });
  }

  saveCashPayment(){
    return this.http.post<AgentResponseData>(GlobalVariable.BASE_API_URL + '/saveCashPayment', this.cashPaymentForm.value);
  }

  saveGoldPayment(){
    return this.http.post<AgentResponseData>(GlobalVariable.BASE_API_URL + '/saveGoldPayment', this.goldPaymentForm.value);
  }
}

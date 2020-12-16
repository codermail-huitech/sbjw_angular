import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Agent} from '../models/agent.model';
import {Rate} from '../models/rate.model';
import {Subject} from 'rxjs';
import {OrderDetail} from '../models/orderDetail.model';
import {Customer} from '../models/customer.model';
import {CustomerResponseData} from './customer.service';

export interface RateResponseData {
  success: number;
  data: object;
}


@Injectable({
  providedIn: 'root'
})

export class RateService {
rateForm: FormGroup;
rateData: Rate[] = [];
private rateSub = new Subject<Rate[]>();

  getRateUpdateListener(){
    return this.rateSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.rateForm = new FormGroup({
      id : new FormControl(null),
      price_code_id : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      p_loss : new FormControl(null, [Validators.required]),
      customer_category_id : new FormControl(null, [Validators.required])
      // customer_category_name : new FormControl(null),
      // price_code_name : new FormControl(null)
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getRates')
      .subscribe((response: {success: number, data: Rate[]}) => {
        // console.log(response);
        const {data} = response;
        // console.log(data);
        this.rateData = data;
        this.rateSub.next([...this.rateData]);
      });
  }

  gettingRateData(){
    return ([...this.rateData]);
  }

  saveRate(){
    return this.http.post(GlobalVariable.BASE_API_URL + '/saveRate', {rateData: this.rateForm.value});
  }

  deleteRate(data){
    return this.http.delete<RateResponseData>('http://127.0.0.1:8000/api/deleteRate/' + data);
  }

  updateRate(){
    return this.http.put<RateResponseData>(GlobalVariable.BASE_API_URL + '/updateRate', {rateData: this.rateForm.value});
  }

}

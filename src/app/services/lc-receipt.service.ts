import { Injectable } from '@angular/core';
import {GlobalVariable} from "../shared/global";
import {LcReceipt} from "../models/lcReceipt.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LcReceiptService {

  lcReceiptList : LcReceipt[]=[];
  lcReceivedForm : FormGroup;
  private  lcReciptListSub = new Subject<LcReceipt[]>();

  getLCReceivedUpdateListener(){
    return this.lcReciptListSub.asObservable();
  }


  constructor( private  http : HttpClient) {

    const received_date = new Date();
    const received_date_format = formatDate(received_date, 'yyyy-MM-dd', 'en');

    this.lcReceivedForm = new FormGroup({
      id : new FormControl(null),
      customer_name: new FormControl({value : null, disabled: true}),
      agent_name: new FormControl({value : null, disabled: true}),
      received_date : new FormControl(received_date_format, [Validators.required]),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl( null, [Validators.required]),
      lc_received : new FormControl( null, [Validators.required])
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getLCReceived')
      .subscribe((response: {success: number, data: LcReceipt[]}) => {
        const {data} = response;
        this.lcReceiptList = data;
        this.lcReciptListSub.next([...this.lcReceiptList]);
      });
  }

  SaveReceivedLC(item){

    console.log('item');
    console.log(item);
    this.lcReceivedForm = item;
    return this.http.post(GlobalVariable.BASE_API_URL + '/SaveLCReceived',this.lcReceivedForm)
      .pipe((tap((response: {success : number , data : LcReceipt})=>{

        this.lcReceiptList.unshift(response.data);
        this.lcReciptListSub.next([...this.lcReceiptList]);
      })));
  }


  getLCReceived(){
    return  [...this.lcReceiptList];
  }
}

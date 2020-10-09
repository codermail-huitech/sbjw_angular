import { Injectable } from '@angular/core';
import {FinishedJobs} from "../models/finishedJobs";
import {HttpClient} from "@angular/common/http";
import {GlobalVariable} from "../shared/global";
import {JobMaster} from "../models/jobMaster.model";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, tap} from 'rxjs/operators';
import {GoldReceipt} from "../models/goldReceipt.model";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class GoldReceiptService {

  completedBillList : GoldReceipt[]=[];
  private completedBillSub = new Subject<GoldReceipt[]>();

  goldReceivedForm : FormGroup;


  getCompletedBillUpdateListener(){
    return this.completedBillSub.asObservable();
  }

  constructor(private http: HttpClient) {

    const received_date = new Date();
    const received_date_format = formatDate(received_date, 'yyyy-MM-dd', 'en');

    this.goldReceivedForm = new FormGroup({
      id : new FormControl(null),
      customer_name: new FormControl({value : null, disabled: true}),
      agent_name: new FormControl({value : null, disabled: true}),
      received_date : new FormControl(received_date_format, [Validators.required]),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl( null, [Validators.required]),
      gold_received : new FormControl( null, [Validators.required])
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getCompletedBills')
      .subscribe((response: {success: number, data: GoldReceipt[]}) => {
        const {data} = response;
        this.completedBillList = data;
        this.completedBillSub.next([...this.completedBillList]);
      });
  }
  SaveReceivedGold(item){

    this.goldReceivedForm = item;
    return this.http.post(GlobalVariable.BASE_API_URL + '/SaveReceivedGold',this.goldReceivedForm)
      .pipe((tap((response: {success : number , data : GoldReceipt})=>{

        this.completedBillList.unshift(response.data);
        this.completedBillSub.next([...this.completedBillList]);
      })));
  }

  getUpdatedList(){
    this.http.get(GlobalVariable.BASE_API_URL + '/getCompletedBills')
      .subscribe((response: {success: number, data: GoldReceipt[]}) => {
        const {data} = response;
        this.completedBillList = data;
        this.completedBillSub.next([...this.completedBillList]);
      });
  }

  getCompletedBills(){
    return  [...this.completedBillList];
  }

}

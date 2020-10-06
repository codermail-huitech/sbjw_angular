import { Injectable } from '@angular/core';
import {FinishedJobs} from "../models/finishedJobs";
import {HttpClient} from "@angular/common/http";
import {GlobalVariable} from "../shared/global";
import {JobMaster} from "../models/jobMaster.model";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, tap} from 'rxjs/operators';
import {GoldReceipt} from "../models/goldReceipt.model";

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

    this.goldReceivedForm = new FormGroup({
      id : new FormControl(null),
      customer_name: new FormControl({value : null, disabled: true}),
      agent_name: new FormControl({value : null, disabled: true}),
      received_date : new FormControl(null, [Validators.required]),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl( null, [Validators.required]),
      bill_master_id : new FormControl( null, [Validators.required]),
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
          let index = this.completedBillList.findIndex(x=>x.id===item.bill_master_id);
          this.completedBillList[index].gold_received = response.data.gold_received;
          // console.log('test');
          // console.log(this.completedBillList);
          this.completedBillSub.next([...this.completedBillList]);
      })));
  }
  getCompletedBills(){
    return  [...this.completedBillList];
  }
}

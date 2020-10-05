import { Injectable } from '@angular/core';
import {FinishedJobs} from "../models/finishedJobs";
import {HttpClient} from "@angular/common/http";
import {GlobalVariable} from "../shared/global";
import {JobMaster} from "../models/jobMaster.model";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoldReceiptService {

  completedBillList : FinishedJobs[]=[];
  private completedBillSub = new Subject<FinishedJobs[]>();

  goldReceivedForm : FormGroup;


  getCompletedBillUpdateListener(){
    return this.completedBillSub.asObservable();
  }

  constructor(private http: HttpClient) {

    this.goldReceivedForm = new FormGroup({
      id : new FormControl(null),
      received_date : new FormControl(null, [Validators.required]),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl( null, [Validators.required]),
      gold_received : new FormControl( null, [Validators.required])
    });

    this.http.get(GlobalVariable.BASE_API_URL + '/getCompletedBills')
      .subscribe((response: {success: number, data: FinishedJobs[]}) => {
        const {data} = response;
        this.completedBillList = data;
        this.completedBillSub.next([...this.completedBillList]);
      });
  }
  SaveReceivedGold(item){

    this.goldReceivedForm = item;
    return this.http.post(GlobalVariable.BASE_API_URL + '/SaveReceivedGold',this.goldReceivedForm)
      .pipe((tap((response)=>{

      })));
  }
}

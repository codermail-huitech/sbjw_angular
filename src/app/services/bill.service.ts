import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FinishedJobs} from "../models/finishedJobs";
import {GlobalVariable} from "../shared/global";
import {Karigarh} from "../models/karigarh.model";
import {Subject} from "rxjs";
import {Product} from "../models/product.model";
import {ProductResponseData} from "./product.service";
import {OrderDetail} from "../models/orderDetail.model";
import {JobMaster} from '../models/jobMaster.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  finshedJobs : FinishedJobs[] = [];
  orderDetails : OrderDetail[] = [];
  finishedJobData : JobMaster[];
  private finishedJobsSub = new Subject<FinishedJobs[]>();
  private orderDetailsSub = new Subject<OrderDetail[]>();
  private finishedJobDataSub = new Subject<JobMaster[]>();

  getFinishedJobsSubUpdateListener(){
    return this.finishedJobsSub.asObservable();
  }

  getOrderDetailsSubUpdateListener(){
    return this.orderDetailsSub.asObservable();
  }

  getfinishedJobDataSubUpdateListener(){
    return this.finishedJobDataSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobsCustomers')
      .subscribe((response: {success: number, data: FinishedJobs[]}) => {
        const {data} = response;
        this.finshedJobs = data;
        console.log(this.finshedJobs);
        this.finishedJobsSub.next([...this.finshedJobs]);
      });
  }

  getFinishedJobs(){
    return([...this.finshedJobs]);
  }

  getDetails(data){
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/fetchingDetails', data)
      .subscribe((response: {success: number, data: OrderDetail[]})  => {
        const {data} = response;
        this.orderDetails = data;
        this.orderDetailsSub.next([...this.orderDetails]);
      });
  }

  getFinishedJobData(data){
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/getFinishedJobData', data)
      .subscribe((response: {success: number, data: JobMaster[]})  => {
        const {data} = response;
        this.finishedJobData = data;
        this.finishedJobDataSub.next([...this.finishedJobData]);
      });
  }
}

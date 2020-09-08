import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FinishedJobs} from "../models/finishedJobs";
import {GlobalVariable} from "../shared/global";
import {Karigarh} from "../models/karigarh.model";
import {Subject, throwError} from "rxjs";
import {Product} from "../models/product.model";
import {ProductResponseData} from "./product.service";
import {OrderDetail} from "../models/orderDetail.model";
import {JobMaster} from '../models/jobMaster.model';
import {catchError, tap} from "rxjs/operators";
import {JobResponseData} from "./job.service";
import {BillDetail} from "../models/billDetail.model";

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

  getGoldQuantity(data){
    return this.http.get<{ success: number, data: BillDetail }>( GlobalVariable.BASE_API_URL + '/getGoldquantity/' + data,{})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: BillDetail}) => {
      })));
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

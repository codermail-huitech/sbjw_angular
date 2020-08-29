import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FinishedJobs} from "../models/finishedJobs";
import {GlobalVariable} from "../shared/global";
import {Karigarh} from "../models/karigarh.model";
import {Subject} from "rxjs";
import {Product} from "../models/product.model";
import {ProductResponseData} from "./product.service";
import {OrderDetail} from "../models/orderDetail.model";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  finshedJobs : FinishedJobs[] = [];
  orderDetails : OrderDetail[] = [];
  private finishedJobsSub = new Subject<FinishedJobs[]>();
  private orderDetailsSub = new Subject<OrderDetail[]>();

  getFinishedJobsSubUpdateListener(){
    return this.finishedJobsSub.asObservable();
  }

  getOrderDetailsSubUpdateListener(){
    return this.orderDetailsSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobsCustomers')
      .subscribe((response: {success: number, data: FinishedJobs[]}) => {
        const {data} = response;
        this.finshedJobs = data;
        this.finishedJobsSub.next([...this.finshedJobs]);
      });
  }

  getDetails(data){
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/fetchingDetails', data)
      .subscribe((response: {success: number, data: OrderDetail[]})  => {
        const {data} = response;
        this.orderDetails = data;
        this.orderDetailsSub.next([...this.orderDetails]);
      });
  }
}

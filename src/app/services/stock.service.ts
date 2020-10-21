import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Stock} from '../models/stock.model';
import {GlobalVariable} from '../shared/global';
import {Rate} from '../models/rate.model';
import {Subject} from 'rxjs';
import {Product} from '../models/product.model';
import {Customer} from '../models/customer.model';

export interface StockResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stockFrom: FormGroup;
  stockData: Stock[] = [];
  // stockCustomers: Customer[] = [];
  // stockCustomerSub = new Subject<Customer[]>();
  private stockSub = new Subject<Stock[]>();

  getStockUpdateListener(){
    return this.stockSub.asObservable();
  }

  // getStockCustomerUpdateListener(){
  //   return this.stockCustomerSub.asObservable();
  // }

  constructor(private http: HttpClient) {
    this.stockFrom = new FormGroup({
      id : new FormControl(null),
      person_name : new FormControl(null,[Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      job_master_id : new FormControl(null, [Validators.required]),
      order_name : new FormControl(null, [Validators.required]),
      approx_gold : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      amount : new FormControl(null, [Validators.required]),
      division : new FormControl(1),
      set_gold : new FormControl(null, [Validators.required]),
      set_quantity : new FormControl(null, [Validators.required]),
      set_amount : new FormControl(null, [Validators.required]),
      // tag : new FormControl(null, [Validators.required])
    });
    this.http.get(GlobalVariable.BASE_API_URL + '/getStockRecord')
      .subscribe((response: {success: number, data: Stock[]}) => {
        const {data} = response;
        this.stockData = data;
        this.stockSub.next([...this.stockData]);
      });

    // this.http.get(GlobalVariable.BASE_API_URL + '/getStockCustomer')
    //   .subscribe((response: { success: number , data: Customer[]}) => {
    //     this.stockCustomers = response.data;
    //     console.log(this.stockCustomers);
    //     this.stockCustomerSub.next([...this.stockCustomers]);
    // });
  }
  saveStock(stockArray) {
    // console.log(stockArray);
    // return ;
    return this.http.post<StockResponseData>(GlobalVariable.BASE_API_URL + '/createStock', stockArray);
  }

  // getUpdatedStockCustomer(){
  //   this.http.get(GlobalVariable.BASE_API_URL + '/getStockCustomer')
  //     .subscribe((response: { success: number , data: Customer[]}) => {
  //       this.stockCustomers = response.data;
  //       console.log(this.stockCustomers);
  //       this.stockCustomerSub.next([...this.stockCustomers]);
  //     });
  // }

  getUpdatedStockRecord(){
    this.http.get(GlobalVariable.BASE_API_URL + '/getStockRecord')
      .subscribe((response: {success: number, data: Stock[]}) => {
        const {data} = response;
        this.stockData = data;
        this.stockSub.next([...this.stockData]);
      });
  }

  getStockRecord(){
    return [...this.stockData];
  }

  // getStockCustomer(){
  //   return [...this.stockCustomers];
  // }

  getStockDataByJobmasterId(id){
    this.http.get(GlobalVariable.BASE_API_URL + '/fetchingStockByJobMasterId/' + id)
      .subscribe((response: { success: number, data: Stock[]}) => {
       this.stockData = response.data;
       this.stockSub.next([...this.stockData]);
      });
  }

}


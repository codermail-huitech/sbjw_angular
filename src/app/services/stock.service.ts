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
  jobMasterData: Stock[];
  jobMasterDataSub = new Subject<Stock[]>();
  // stockCustomers: Customer[] = [];
  // stockCustomerSub = new Subject<Customer[]>();
  private stockSub = new Subject<Stock[]>();

  getStockUpdateListener(){
    return this.stockSub.asObservable();
  }

  // getStockCustomerUpdateListener(){
  //   return this.stockCustomerSub.asObservable();
  // }

  getJobMasterDataUpdateListener(){
    return this.jobMasterDataSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.stockFrom = new FormGroup({
      id : new FormControl(null),
      person_name : new FormControl(null,[Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      job_master_id : new FormControl(null, [Validators.required]),
      order_name : new FormControl(null, [Validators.required]),
      job_number : new FormControl(null, [Validators.required]),
      // approx_gold : new FormControl(null, [Validators.required]),
      total_gold : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      gross_weight : new FormControl(null, [Validators.required]),
      amount : new FormControl(null, [Validators.required]),
      division : new FormControl(1),
      set_gold : new FormControl(null, [Validators.required]),
      set_quantity : new FormControl(null, [Validators.required]),
      set_amount : new FormControl(null, [Validators.required]),
      set_gross_weight : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      // tag : new FormControl(null, [Validators.required])
    });
    this.http.get(GlobalVariable.BASE_API_URL + '/getStockList').subscribe((response: {success: number, data: Stock[]})=>{
      this.stockData = response.data;
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

  getUpdatedStockRecord(){
    this.http.get(GlobalVariable.BASE_API_URL + '/getStockRecord')
      .subscribe((response: {success: number, data: Stock[]}) => {
        const {data} = response;
        this.stockData = data;
        this.stockSub.next([...this.stockData]);
      });
  }

  getStockList(){
    return [...this.stockData];
  }

  getUpdatedStockList(){
    this.http.get(GlobalVariable.BASE_API_URL + '/getStockList').subscribe((response: {success: number, data: Stock[]})=>{
      this.stockData = response.data;
      this.stockSub.next([...this.stockData]);
    });
  }



  // getStockCustomer(){
  //   return [...this.stockCustomers];
  // }

  getRecordByJobMasterId(id){
     return this.http.get(GlobalVariable.BASE_API_URL + '/getRecordByJobMasterId/' + id)
       .subscribe((response: {success: number, data: Stock[]}) => {
          this.jobMasterData = response.data;
          this.jobMasterDataSub.next([...this.jobMasterData]);
       });

  }

  updateStockByAgent(stockArray, AgentID){
    return this.http.post(GlobalVariable.BASE_API_URL + '/updateStockByAgentId', {stockList: stockArray, agentId: AgentID});
  }

  updateStockByDefaultAgent(stockArray, AgentID){
    return this.http.post(GlobalVariable.BASE_API_URL + '/updateStockByDefaultAgentId', {stockList: stockArray, agentId: AgentID});
  }

  // getStockList(){
  //   this.http.get(GlobalVariable.BASE_API_URL + '/getStockList').subscribe((response: {success: number, data: Stock[]})=>{
  //       this.stockData = response.data;
  //       this.stockSub.next([...this.stockData]);
  //   });
  // }

}


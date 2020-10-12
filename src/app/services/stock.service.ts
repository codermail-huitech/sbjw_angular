import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Stock} from '../models/stock.model';
import {GlobalVariable} from '../shared/global';
import {Rate} from '../models/rate.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stockFrom: FormGroup;
  stockData: Stock[] = [];
  private stockSub = new Subject<Stock[]>();

  getStockUpdateListener(){
    return this.stockSub.asObservable();
  };

  constructor(private http: HttpClient) {
    this.stockFrom = new FormGroup({
      id : new FormControl(null),
      order_details_id : new FormControl(null, [Validators.required]),
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
        // console.log(response);
        const {data} = response;
        // console.log(data);
        this.stockData = data;
        this.stockSub.next([...this.stockData]);
      });
  }
}

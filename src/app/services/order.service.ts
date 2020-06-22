import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Agent} from '../models/agent.model';
import {Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Material} from '../models/material.model';
import {OrderMaster} from '../models/orderMaster.model';
import {OrderDetail} from '../models/orderDetail.model';
import {Product} from '../models/product.model';
import {catchError, tap} from 'rxjs/operators';
import {Customer} from '../models/customer.model';


export interface OrderResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  materialData: Material[] = [];
  agentData: Agent[] = [];
  orderMaster: OrderMaster;
  orderDetails: OrderDetail[] = [];
  private agentSub = new Subject<Agent[]>();
  private materialSub = new Subject<Material[]>();
  private orderSub = new Subject<OrderMaster>();
  orderData: {};

  getAgentUpdateListener(){
    console.log('customer listener called');
    return this.agentSub.asObservable();
  }

  getMaterialUpdateListener(){
    console.log('customer listener called');
    return this.materialSub.asObservable();
  }

  getOrderUpdateListener(){
    console.log('customer listener called');
    return this.orderSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.orderMasterForm = new FormGroup({
      id : new FormControl(null),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      order_date : new FormControl('', [Validators.required]),
      delivery_date : new FormControl(null, [Validators.required])
    });

    this.orderDetailsForm = new FormGroup({
      material_id : new FormControl(3, [Validators.required]),
      model_number : new FormControl(null, [Validators.required]),
      pLoss : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      price_code : new FormControl(null, [Validators.required]),
      approx_gold : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      amount : new FormControl({value: null, disabled: true} , [Validators.required])
    });

    this.http.get('http://127.0.0.1:8000/api/agents')
      .subscribe((response: {success: number, data: Agent[]}) => {
        const {data} = response;
        this.agentData = data;
        this.agentSub.next([...this.agentData]);
      });

    // this.http.get('http://127.0.0.1:8000/api/materials')
    //   .subscribe((response: {success: number, data: Material[]}) => {
    //     const {data} = response;
    //     this.materialData = data;
    //     this.materialSub.next([...this.materialData]);
    //   });

    this.http.get('http://127.0.0.1:8000/api/orderMaterials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        console.log(this.materialData);
        this.materialSub.next([...this.materialData]);
      });

    this.http.get('http://127.0.0.1:8000/api/orders')
      .subscribe((response: {success: number, data: object}) => {
        const {data} = response;
        this.orderMaster = data;
        console.log("order master");
        console.log(this.orderMaster);
        this.orderSub.next([...this.orderMaster]);
      });
  }

  setOrderMasterData() {
    this.orderMaster = this.orderMasterForm.value;
  }

  setOrderDetails(){
    this.orderDetails.unshift(this.orderDetailsForm.value);
  }

  saveOrder(){
       return this.http.post<OrderResponseData>('http://127.0.0.1:8000/api/orders', {master: this.orderMaster, details: this.orderDetails})
         .pipe(catchError(this._serverError), tap(((response: {success: number, data: object}) => {
             console.log(response);
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
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
}

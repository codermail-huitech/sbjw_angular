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
  // storing material
  materialData: Material[] = [];
  // storing agent
  agentData: Agent[] = [];
  // orderMaster is used to store the form orderMasterForm.value
  orderMaster: OrderMaster;
  // orderMasterData used to store the orderList
  orderMasterData: object;
  // orderDetails used to store all the details in this array
  orderDetails: OrderDetail[] = [];
  // orderDetailUpdate is for updating a single odder details
  orderDetailUpdate: object;
  private agentSub = new Subject<Agent[]>();
  private materialSub = new Subject<Material[]>();
  private orderSub = new Subject<OrderMaster[]>();
  private orderDetailsSub = new Subject<OrderDetail[]>();

  getAgentUpdateListener(){
    return this.agentSub.asObservable();
  }

  getOrderDetailsListener(){
    return this.orderDetailsSub.asObservable();
  }
  getMaterialUpdateListener(){
    return this.materialSub.asObservable();
  }

  getOrderUpdateListener(){
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
      id : new FormControl(null),
      material_id : new FormControl(3, [Validators.required]),
      model_number : new FormControl(null, [Validators.required]),
      p_loss : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      price_code : new FormControl(null, [Validators.required]),
      approx_gold : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      amount : new FormControl({value: null, disabled: true} , [Validators.required])
    });
    // fetching agents
    this.http.get('http://127.0.0.1:8000/api/agents')
      .subscribe((response: {success: number, data: Agent[]}) => {
        const {data} = response;
        this.agentData = data;
        this.agentSub.next([...this.agentData]);
      });

    this.http.get('http://127.0.0.1:8000/api/orderMaterials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        // console.log(this.materialData);
        this.materialSub.next([...this.materialData]);
      });

    // fetching order List
    this.http.get('http://127.0.0.1:8000/api/orders')
      .subscribe((response: {success: number, data: object}) => {
        const {data} = response;
        this.orderMasterData = data;
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      });
  }
  // this function is to save the orderMasterForm value while pressing in save
  setOrderMasterData() {
    this.orderMaster = this.orderMasterForm.value;
  }
  // this function is to unshift the details while pressing in add product
  setOrderDetails(){
    this.orderDetails.unshift(this.orderDetailsForm.value);
  }
  // this function sets the data for order details update for single product
  setOrderDetailsForUpdate(){
    this.orderDetailUpdate = this.orderDetailsForm.value;
  }


  saveOrder(){
       return this.http.post<OrderResponseData>('http://127.0.0.1:8000/api/orders', {master: this.orderMaster, details: this.orderDetails})
         .pipe(catchError(this._serverError), tap(((response: {success: number, data: object}) => {
           })));
    }

  fetchOrderDetails(order_master_id){
    this.http.post('http://127.0.0.1:8000/api/orderDetails', {orderMasterId: order_master_id})
      .subscribe((response: {success: number, data: OrderDetail[]}) => {
        const {data} = response;
        this.orderDetails = data;
        this.orderDetailsSub.next([...this.orderDetails]);
      });
  }

  updateOrder(){
    this.http.patch('http://127.0.0.1:8000/api/orders', {master: this.orderMaster, details: this.orderDetailUpdate})
      .subscribe((response: {success: number, orderDetail: object, orderMaster: object}) => {

        // instant changing the order details after update
        const {orderDetail} = response;
        // @ts-ignore
        const detailIndex = this.orderDetails.findIndex(x => x.id === this.orderDetailUpdate.id);
        if (response.orderDetail instanceof OrderDetail) {
          this.orderDetails[detailIndex] = response.orderDetail;
        }
        this.orderDetailsSub.next([...this.orderDetails]);

        // instant changing the order master after update
        const {orderMaster} = response;
        // @ts-ignore
        const masterIndex = this.orderMasterData.findIndex(x => x.id === this.orderMaster.id);
        this.orderMasterData[masterIndex] = response.orderMaster;
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      });
  }

  masterUpdate(){
    // console.log(id);
    return this.http.patch<{success: number, data: object}>('http://127.0.0.1:8000/api/orderMaster', { master: this.orderMasterForm.value})
      .pipe(catchError(this._serverError), tap((response: {success: number, data: object}) => {
        const {data} = response;
        // @ts-ignore
        const masterIndex = this.orderMasterData.findIndex(x => x.id === this.orderMasterForm.value.id);
        this.orderMasterData[masterIndex] = response.data;
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      }));
  }

  deleteOrderDetails(id){
    return this.http.delete<{success: number, data: string}>('http://127.0.0.1:8000/api/ordersDetailsDelete/' + id)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: string}) => {
        const index = this.orderDetails.findIndex(x => x.id === id);
        this.orderDetails.splice(index , 1);
        this.orderDetailsSub.next([...this.orderDetails]);
      }));
  }

  deleteOrderMaster(id){
    return this.http.delete<{success: number, data: string}>('http://127.0.0.1:8000/api/orderMasterDelete/' + id)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: string}) => {
        // @ts-ignore
        const index = this.orderMasterData.findIndex(x => x.id === id);
        // @ts-ignore
        this.orderMasterData.splice(index , 1);
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      }));
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

import { Component, OnInit } from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
// import {FormGroup} from "@angular/forms";
import {FormGroup} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {Agent} from '../../models/agent.model';
import {Material} from '../../models/material.model';
import alasql from 'alasql';
import { DatePipe } from '@angular/common';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {OrderDetail} from '../../models/orderDetail.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})

export class OrderComponent implements OnInit {

  // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  customerList: Customer[];
  agentList: Agent[];
  materialList: Material[];
  products: Product[];
  orderDetails: OrderDetail[] = [];
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  startDate = new Date(2020, 0, 2);

  pipe = new DatePipe('en-US');

  now = Date.now();


  // tslint:disable-next-line:max-line-length
  constructor(private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private productService: ProductService, private _snackBar: MatSnackBar) {
  }
  onlyOdds = (d: Date): boolean => {
    const date = d.getDate();
    // Even dates are disabled.
    return true;
    return date % 2 === 0;
  }

  ngOnInit(): void {
    this.orderMasterForm = this.orderService.orderMasterForm;
    this.orderDetailsForm = this.orderService.orderDetailsForm;
    // this.orderDetailsForm.controls['amount'].disable();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerList = customers;
      });

    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
        // this.materialList =  alasql("select * from ? where material_name='90 Ginnie' or material_name='92 Ginnie'", [this.materialList]);
      });

    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });
  }

  addOrder(){
    const index = this.products.findIndex(x => x.model_number === this.orderDetailsForm.value.model_number);
    this.orderDetailsForm.value.product_id = this.products[index].id;
    this.orderService.setOrderDetails();
    this.orderDetailsForm.reset();
    this.orderDetailsForm.value.amount = null;
    this.orderDetails = this.orderService.orderDetails;
    // console.log(this.orderDetailsForm);
  }

  findModel(){
    const index = this.products.findIndex(k => k.model_number === this.orderDetailsForm.value.model_number);
    if (index === -1){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'No Model Number Found'}
      });
    }
    if (index !== -1){
      const x = this.products[index];
      this.orderDetailsForm.patchValue({pLoss : x.p_loss, price_code : x.price_code_name, price : x.price});
    }
  }

  clearForm(){
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  onSubmit(){
    let saveObserable = new Observable<any>();
    saveObserable = this.orderService.saveOrder();
    saveObserable.subscribe((response) => {
      if (response.success === 1){
        this.orderMasterForm.reset();
        this.orderDetailsForm.reset();
        this.orderDetails = [];
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Saved'}
        });
      }
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }

  selectCustomerForOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.setOrderMasterData();
  }
}

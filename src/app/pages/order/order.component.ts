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
  orderDetails = [];
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  startDate = new Date(2020, 0, 2);

  pipe = new DatePipe('en-US');

  now = Date.now();



  // tslint:disable-next-line:max-line-length
  constructor(private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private productService: ProductService) {
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
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy/MM/dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy/MM/dd');
    console.log(this.orderMasterForm.value.order_date);
    console.log(this.orderMasterForm.value.delivery_date);
    this.orderDetails.push(this.orderDetailsForm.value);
    this.orderDetailsForm.reset();
    // console.log(this.orderDetails);
  }

  clearForm(){
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  onSubmit(){
    console.log('Order Master');
    console.log(this.orderMasterForm.value);
    console.log('Order Details');
    console.log(this.orderDetails);
  }

  selectCustomerForOrder() {
    this.storage.set('orderFormValue', this.orderMasterForm.value);
    console.log(this.orderMasterForm.value);
    const x = this.storage.get('orderFormValue');
    console.log(x);
  }
}

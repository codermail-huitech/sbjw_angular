import { Component, OnInit } from '@angular/core';
import {Customer} from "../../models/customer.model";
import {CustomerService} from "../../services/customer.service";
// import {FormGroup} from "@angular/forms";
import {FormControl, FormGroup} from '@angular/forms';
import {OrderService} from "../../services/order.service";
import {Agent} from "../../models/agent.model";
import {Material} from "../../models/material.model";
import alasql from 'alasql';
import { DatePipe } from '@angular/common';
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product.model";

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
  orderForm: FormGroup;
  pipe = new DatePipe('en-US');

  now = Date.now();



  constructor(private customerService: CustomerService, private orderService: OrderService,private productService: ProductService) {

  }

  ngOnInit(): void {
    this.orderForm = this.orderService.orderForm;
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
        this.materialList =  alasql("select * from ? where material_name='90 Ginnie' or material_name='92 Ginnie'", [this.materialList]);
      });

    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });
  }

  onSubmit(){
    console.log(this.orderForm.value);
    // console.log(this.orderForm.value.order_date.transform("dd-MM-yyyy"));
    // console.log(this.datePipe.transform("Date Thu Jun 25 2020 00:00:00 GMT+0530","dd-MM-yyyy"))

    this.orderForm.value.order_date = this.pipe.transform(this.orderForm.value.order_date, 'yyyy/MM/dd');
    this.orderForm.value.delivery_date = this.pipe.transform(this.orderForm.value.delivery_date, 'yyyy/MM/dd');
    console.log(this.orderForm.value.order_date);
    console.log(this.orderForm.value.delivery_date);


  }

}

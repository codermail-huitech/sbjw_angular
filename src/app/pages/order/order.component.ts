import { Component, OnInit } from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
// import {FormGroup} from "@angular/forms";
import {FormControl, FormGroup} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {Agent} from '../../models/agent.model';
import {Material} from '../../models/material.model';
import alasql from 'alasql';


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
  orderForm: FormGroup;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2)
  maxDate = new Date(2021, 3, 2)
  startDate = new Date(2020, 0, 2);
  constructor(private customerService: CustomerService, private orderService: OrderService) {

  }
  onlyOdds = (d: Date): boolean => {
    const date = d.getDate();
    // Even dates are disabled.
    return true;
    return date % 2 == 0;
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
        console.log(this.materialList);
        this.materialList =  alasql("select * from ? where material_name='90 Ginnie' or material_name='92 Ginnie'", [this.materialList]);
        console.log(this.materialList);

      });
  }

}

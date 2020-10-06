import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {OrderService} from "../../services/order.service";
import {LcReceiptService} from "../../services/lc-receipt.service";
import {LcReceipt} from "../../models/lcReceipt.model";
import {Customer} from "../../models/customer.model";
import {Agent} from "../../models/agent.model";
import {DatePipe} from "@angular/common";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-lc-receipts',
  templateUrl: './lc-receipts.component.html',
  styleUrls: ['./lc-receipts.component.scss']
})
export class LcReceiptsComponent implements OnInit {

  lcReceiptList : LcReceipt[];
  customerList : Customer[];
  agentList : Agent[];

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private  customerService : CustomerService , private orderService : OrderService ,private lcReceiptService : LcReceiptService) {
    // this.lcReceiptList = this.lcReceiptService.getLcReceiptList();
    this.customerList = this.customerService.getCustomers();
    this.agentList = this.orderService.getAgentList();

    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.lcReceiptService.getLCReceivedUpdateListener().subscribe((response) => {
      this.lcReceiptList=response;
    });
    this.customerService.getCustomerUpdateListener().subscribe((response) => {
      this.customerList = response;
    });
    this.orderService.getAgentUpdateListener().subscribe((response) => {
      this.agentList = response;
    });
  }

}

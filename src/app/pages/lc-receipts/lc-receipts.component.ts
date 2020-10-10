import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {OrderService} from "../../services/order.service";
import {LcReceiptService} from "../../services/lc-receipt.service";
import {LcReceipt} from "../../models/lcReceipt.model";
import {Customer} from "../../models/customer.model";
import {Agent} from "../../models/agent.model";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-lc-receipts',
  templateUrl: './lc-receipts.component.html',
  styleUrls: ['./lc-receipts.component.scss']
})
export class LcReceiptsComponent implements OnInit {

  lcReceiptList : LcReceipt[];
  customerList : Customer[];
  agentList : Agent[];
  lcReceivedForm : FormGroup;

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private  customerService : CustomerService , private orderService : OrderService ,private lcReceiptService : LcReceiptService) {
    this.lcReceiptList = this.lcReceiptService.getLCReceived();
    this.customerList = this.customerService.getCustomers();
    this.agentList = this.orderService.getAgentList();

    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.lcReceivedForm = this.lcReceiptService.lcReceivedForm;
    this.lcReceiptService.getLCReceivedUpdateListener().subscribe((response) => {
      this.lcReceiptList=response;
      console.log('length');
      console.log(this.lcReceiptList.length);
    });
    this.customerService.getCustomerUpdateListener().subscribe((response) => {
      this.customerList = response;
    });
    this.orderService.getAgentUpdateListener().subscribe((response) => {
      this.agentList = response;
    });
  }

  onSubmit(){
    Swal.fire({
      title: 'Do you want to submit L.C ?',
      text: 'L.C  will be added in the  list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel it'
    }).then((result) => {
      if (result.value) {
        this.lcReceivedForm.value.received_date = this.pipe.transform(this.lcReceivedForm.value.received_date, 'yyyy-MM-dd');
        this.lcReceiptService.SaveReceivedLC(this.lcReceivedForm.value).subscribe((response) => {
          if (response.success === 1) {
            Swal.fire(
              'Done!',
              'Received L.C. Submitted',
              'success'
            );
            this.lcReceivedForm.reset();
          }
        });
      }
    });
  }



}

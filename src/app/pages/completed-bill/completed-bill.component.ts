import { Component, OnInit } from '@angular/core';
import {FinishedJobs} from "../../models/finishedJobs";
import {OrderDetail} from "../../models/orderDetail.model";
import {BillService} from "../../services/bill.service";

@Component({
  selector: 'app-completed-bill',
  templateUrl: './completed-bill.component.html',
  styleUrls: ['./completed-bill.component.scss']
})
export class CompletedBillComponent implements OnInit {
  finshedJobs: FinishedJobs[] = [];
  orderDetails: OrderDetail[];

  constructor(private  billService: BillService) { }


  ngOnInit(): void {
    this.billService.getCompletedBillDataSubUpdateListener().subscribe((finishedJobs) => {
      this.finshedJobs = finishedJobs;
    });
    this.finshedJobs = this.billService.getCompletedBills();
  }

}

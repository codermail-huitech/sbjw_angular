import { Component, OnInit } from '@angular/core';
import {FinishedJobs} from "../../models/finishedJobs";
import {OrderDetail} from "../../models/orderDetail.model";
import {BillService} from "../../services/bill.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-completed-bill',
  templateUrl: './completed-bill.component.html',
  styleUrls: ['./completed-bill.component.scss']
})
export class CompletedBillComponent implements OnInit {
  finshedJobs: FinishedJobs[] = [];
  orderDetails: OrderDetail[];
  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private  billService: BillService) {
    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.billService.getCompletedBillDataSubUpdateListener().subscribe((finishedJobs) => {
      this.finshedJobs = finishedJobs;
    });
    this.finshedJobs = this.billService.getCompletedBills();
  }

}

import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {FinishedJobs} from "../../models/finishedJobs";
import {Material} from "../../models/material.model";
import {OrderDetail} from "../../models/orderDetail.model";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  finshedJobs: FinishedJobs[] = [];
  orderDetails: OrderDetail[];

  constructor(private  billService: BillService) { }

  ngOnInit(): void {
    this.billService.getFinishedJobsSubUpdateListener().subscribe((finishedJobs) => {
       this.finshedJobs = finishedJobs;
    });
    this.finshedJobs = this.billService.getFinishedJobs();
  }
}

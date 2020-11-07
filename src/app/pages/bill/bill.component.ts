import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {FinishedJobs} from "../../models/finishedJobs";
import {Material} from "../../models/material.model";
import {OrderDetail} from "../../models/orderDetail.model";
import {JobService} from "../../services/job.service";
import {JobMaster} from "../../models/jobMaster.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  public searchTerm: string;
  finshedJobs: FinishedJobs[] = [];
  orderDetails: OrderDetail[];

  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private  billService: BillService , private  jobService : JobService) {
    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.billService.getFinishedJobsSubUpdateListener().subscribe((finishedJobs) => {
       this.finshedJobs = finishedJobs;
    });
    this.finshedJobs = this.billService.getFinishedJobs();

  }
}

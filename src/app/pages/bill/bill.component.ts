import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {FinishedJobs} from "../../models/finishedJobs";
import {Material} from "../../models/material.model";
import {OrderDetail} from "../../models/orderDetail.model";
import {JobService} from "../../services/job.service";
import {JobMaster} from "../../models/jobMaster.model";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  public searchTerm: string;
  finshedJobs: FinishedJobs[] = [];
  // finshedJobs: JobMaster[] = [];
  orderDetails: OrderDetail[];

  constructor(private  billService: BillService , private  jobService : JobService) { }

  ngOnInit(): void {
    this.billService.getFinishedJobsSubUpdateListener().subscribe((finishedJobs) => {
       this.finshedJobs = finishedJobs;
    });
    this.finshedJobs = this.billService.getFinishedJobs();

  }
}

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
  finshedJobs : FinishedJobs[] = [];
  showDetails = false;
  orderDetails: OrderDetail[];

  constructor(private  billService : BillService) { }

  ngOnInit(): void {
    this.showDetails = false;

    this.billService.getFinishedJobsSubUpdateListener().subscribe((finishedJobs)=>{
       this.finshedJobs=finishedJobs;
    })

    this.billService.getOrderDetailsSubUpdateListener()
      .subscribe((details: OrderDetail[]) => {
        this.orderDetails = details;
    });

  }

  getDetails(data){
    this.showDetails = true;
    let data1 = this.billService.getDetails(data.order_master_id);
    console.log('data1');
    console.log(data1);
  }

  changeShowDetails(){
    this.showDetails = false;
  }

}

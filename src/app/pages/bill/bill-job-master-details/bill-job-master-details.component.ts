import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';
import {OrderDetail} from '../../../models/orderDetail.model';
import {JobMaster} from '../../../models/jobMaster.model';
// import {Location} from '@angular/common';

@Component({
  selector: 'app-bill-job-master-details',
  templateUrl: './bill-job-master-details.component.html',
  styleUrls: ['./bill-job-master-details.component.scss']
})
export class BillJobMasterDetailsComponent implements OnInit {

  finishedJobData : JobMaster[];

  constructor(private  route : ActivatedRoute, private billService : BillService)  { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
       // console.log(params['id']);
      this.billService.getFinishedJobData(params['id']);
    });

    this.billService.getfinishedJobDataSubUpdateListener()
      .subscribe((details: JobMaster[]) => {
        this.finishedJobData = details;
        // console.log('bill_order_details');
        console.log(this.finishedJobData );
      });
  }
  // backbtn(){
  //   this.location.back();
  // }

}

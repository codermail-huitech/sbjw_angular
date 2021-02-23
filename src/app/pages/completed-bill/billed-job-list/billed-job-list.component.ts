import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';
import {FinishedJobs} from '../../../models/finishedJobs';
import {templateJitUrl} from '@angular/compiler';

@Component({
  selector: 'app-billed-job-list',
  templateUrl: './billed-job-list.component.html',
  styleUrls: ['./billed-job-list.component.scss']
})
export class BilledJobListComponent implements OnInit {
  billedJobList: FinishedJobs[];
  showReport = false;
  jobReport: any[];
  jobNumber: string;
  totalBilledGold: any;
  totalPureGold: any;
  testMath =  Math;

  constructor(private  route: ActivatedRoute, private billService: BillService) { }

  ngOnInit(): void {
    this.showReport = false;
    this.route.params.subscribe(params => {
      // console.log(params.id);
      this.billService.getBilledJobList(params.id);
      this.billService.getBilledJobListSubUpdateListener().subscribe((response)=>{
        this.billedJobList  = response;
      });
    });
  }
  getReport(item){
    console.log(item);
    this.totalBilledGold = 0;
    this.totalPureGold = 0;
    this.billService.getBilledJobReport(item.id).subscribe((response) => {
       if(response.data){
         this.showReport = true;
         this.jobReport = response.data;
         for (let i = 0; i < this.jobReport.length ; i++){
            this.totalBilledGold = this.totalBilledGold + this.jobReport[i].total;
         }
         this.totalPureGold = this.totalBilledGold * 0.92;
         this.jobNumber = item.job_number;
       }
     });
  }

}

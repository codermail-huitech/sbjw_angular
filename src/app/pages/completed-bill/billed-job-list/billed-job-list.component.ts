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

  constructor(private  route: ActivatedRoute,private billService: BillService) { }

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
     this.billService.getBilledJobReport(item.id).subscribe((response) => {
       if(response.data){
         this.showReport = true;
         this.jobReport = response.data;
         this.jobNumber = item.job_number;
       }
     });
  }

}

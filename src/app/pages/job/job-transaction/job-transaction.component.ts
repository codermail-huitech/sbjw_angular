import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from 'rxjs';
import {JobDetail} from 'src/app/models/jobDetail.model';
import {JobTaskService} from "../../../services/job-task.service";

@Component({
  selector: 'app-job-transaction',
  templateUrl: './job-transaction.component.html',
  styleUrls: ['./job-transaction.component.scss']
})


export class JobTransactionComponent implements OnInit {

  jobMasterId : number;
  jobTransactionData : JobDetail[];

  constructor(private router : ActivatedRoute, private  jobTaskService : JobTaskService) { }

  ngOnInit(): void {
    this.router.params.subscribe((params)=>{
      this.jobMasterId = params.id;
  })
  this.jobTaskService.getJobTransactionDataUpdateListener().subscribe((TransactionData : JobDetail[])=>{{
    this.jobTransactionData =  TransactionData;
  }})

  this.jobTaskService.getAllTransactions(this.jobMasterId).subscribe((response )=>{
    this.jobTransactionData =  response.data;

   });
  }

}

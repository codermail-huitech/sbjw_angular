import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JobTaskService} from "../../../services/job-task.service";

@Component({
  selector: 'app-job-transaction',
  templateUrl: './job-transaction.component.html',
  styleUrls: ['./job-transaction.component.scss']
})


export class JobTransactionComponent implements OnInit {

  jobMasterId : number;

  constructor(private router : ActivatedRoute, private  jobTaskService : JobTaskService) { }

  ngOnInit(): void {
   this.router.params.subscribe((params)=>{
       this.jobMasterId = params.id;
   })
   this.jobTaskService.getAllTransactions(this.jobMasterId);
  }

}

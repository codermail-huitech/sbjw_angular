import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobTaskService} from '../../../../services/job-task.service';
import {JobDetail} from '../../../../models/jobDetail.model';
import {JobDetailComponent} from '../job-detail.component';
import { Input } from '@angular/core';

@Component({
  selector: 'app-job-transaction',
  templateUrl: './job-transaction.component.html',
  styleUrls: ['./job-transaction.component.scss']
})
export class JobTransactionComponent implements OnInit {

  jobMasterId: number;
  jobTransactionData: JobDetail[];

  constructor(private router: ActivatedRoute, private  jobTaskService: JobTaskService) { }
  ngOnInit(): void {
    this.router.parent.params.subscribe(params => {
      this.jobMasterId = params.id;
      // this.jobTaskService.getBatchCount(this.jobMasterId);
    });
    this.jobTaskService.getJobTransactionDataUpdateListener().subscribe((TransactionData: JobDetail[]) => {{
      this.jobTransactionData =  TransactionData;
    }});
    this.jobTaskService.getAllTransactions(this.jobMasterId).subscribe((response ) => {
      this.jobTransactionData =  response.data;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobTaskService} from '../../../services/job-task.service';
import {AuthService} from '../../../services/auth.service';
import {JobService} from '../../../services/job.service';
import {JobMaster} from '../../../models/jobMaster.model';
import {FormGroup} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {Material} from '../../../models/material.model';
import {Karigarh} from '../../../models/karigarh.model';
import {User} from '../../../models/user.model';
import {JobDetail} from '../../../models/jobDetail.model';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  sub: object;
  id: number;
  job_number: string;
  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  oneJobData: JobMaster;
  materialList: Material[];
  karigarhData: Karigarh[];
  userData: User;
  karigarhName: string;
  totalData: JobDetail[];
  showTransactionDiv = false;
  jobTransactionData: JobDetail[];


  constructor(private route: ActivatedRoute, private jobTaskService: JobTaskService, private orderService: OrderService, private authService: AuthService, private jobService: JobService) {
  }

  printDivStyle = {
    table: {'border-collapse': 'collapse', width : '35%'},
    label: {width: '35%'},
    h1 : {color: 'red'},
    h2 : {border: 'solid 1px'},
    td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };

  ngOnInit(): void {
    this.showTransactionDiv = true;
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.route.params.subscribe(params => {
      this.showTransactionDiv = false;
      this.id = params.id;
      this.jobTaskForm.patchValue({id : params.id });
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id === this.id);
      if (index === -1){
        this.jobTaskService.getFinishedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
          this.savedJobsData = jobData;
          const index = this.savedJobsData.findIndex(x => x.id == this.id);
          this.oneJobData = this.savedJobsData[index];
          this.jobTaskForm.patchValue({id : this.id});
          this.jobTaskForm.value.id = this.oneJobData.id;
          this.job_number = this.oneJobData.job_number;
        });
        this.savedJobsData = this.jobTaskService.getFinishedJobList();
        const index = this.savedJobsData.findIndex(x => x.id === this.id);
        this.oneJobData = this.savedJobsData[index];
      }else{
        this.oneJobData = this.savedJobsData[index];
      }

      this.karigarhData = this.jobService.getAllKarigarhs();
      const karigarhIndex = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      if (this.karigarhData[karigarhIndex].person_name){
        this.karigarhName = this.karigarhData[karigarhIndex].person_name;
      }

    });

    this.jobTaskForm = this.jobTaskService.jobTaskForm;

    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
      const index = this.savedJobsData.findIndex(x => x.id === this.id);
      this.oneJobData = this.savedJobsData[index];

      this.jobTaskForm.patchValue({id : this.id});
      this.jobTaskForm.value.id = this.oneJobData.id;
      this.job_number = this.oneJobData.job_number;
    });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
        const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
        const f = this.materialList[index];
        this.jobTaskForm.patchValue({material_name : f.material_name, size: this.oneJobData.size});
      });

    this.jobService.getKarigarhUpdateListener().subscribe((karigarhData: Karigarh[]) => {
      this.karigarhData = karigarhData;
      const karigarhIndex = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      if (this.karigarhData[karigarhIndex].person_name){
        this.karigarhName = this.karigarhData[karigarhIndex].person_name;
      }
    });
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.jobTaskService.getTotal().subscribe((response) => {
      this.totalData = response.data;
    });
    this.jobTaskService.getTotalDataUpdateListener().subscribe((response) => {
      this.totalData = response;
    });

    this.jobTaskService.getJobTransactionDataUpdateListener().subscribe((TransactionData: JobDetail[]) => {{
      this.jobTransactionData =  TransactionData;
    }});
    this.jobTaskService.getAllTransactions(this.id).subscribe((response ) => {
      this.jobTransactionData =  response.data;
    });
  }
}

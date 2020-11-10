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
  tempTotalData = [0, 0 , 0 , 0 , 0 , 0, 0, 0];


  constructor(private route: ActivatedRoute , private  jobTaskService: JobTaskService , private  jobService: JobService , private  orderService: OrderService) {
    this.karigarhData = this.jobService.getAllKarigarhs();
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
      this.id = parseInt(params.id);
      this.jobTaskForm.patchValue({id: params.id});
      this.jobTaskService.getUpdatedSavedJobs();
      this.jobTaskService.getUpdatedFinishedJobs();
      this.jobTaskService.getSavedJobsUpdateListener().subscribe((response) => {
        this.savedJobsData = response;
        const index = this.savedJobsData.findIndex(x => x.id === this.id);
        if (index === -1){
          this.jobTaskService.getFinishedJobsUpdateListener().subscribe((response) => {
            this.savedJobsData = response;
            const index = this.savedJobsData.findIndex(x => x.id === this.id);
            this.oneJobData = this.savedJobsData[index];
            this.jobTaskForm.patchValue({id: this.oneJobData.id});
            this.jobTaskForm.value.id = this.oneJobData.id;
            this.job_number = this.oneJobData.job_number;
          });
        }
        else{
          this.oneJobData = this.savedJobsData[index];
          this.jobTaskForm.patchValue({id: this.oneJobData.id});
          this.job_number = this.oneJobData.job_number;
        }
      });
      this.userData = JSON.parse(localStorage.getItem('user'));
      this.orderService.getMaterialUpdateListener().subscribe((response) => {
        this.materialList = response;
        const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
        const materialData = this.materialList[index];
        this.jobTaskForm.patchValue({material_name: materialData.material_name , size: this.oneJobData.size});
      });
      this.jobService.getKarigarhUpdateListener().subscribe((response) => {
        this.karigarhData = response;
        const index = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
        this.karigarhName = this.karigarhData[index].person_name;
        // console.log(this.karigarhName);
      });
       this.jobTaskService.getTotalData();
      this.jobTaskService.getTotal().subscribe((response) => {
        this.totalData = response.data;
        for (let i = 1; i <= 8; i ++){
          const index = this.totalData.findIndex(x => x.id === i);
          if (index >= 0)
          {
            this.tempTotalData[i - 1] = this.totalData[index].total;
          }
          else{
            this.tempTotalData[i - 1] = 0;
          }
        }
      });
      this.jobTaskService.getTotalDataUpdateListener().subscribe((response) => {
        this.totalData = response;
        for (let i = 1; i <= 8; i ++){
          const index = this.totalData.findIndex(x => x.id === i);
          if (index >= 0)
          {
            this.tempTotalData[i - 1] = this.totalData[index].total;
          }
          else{
            this.tempTotalData[i - 1] = 0;
          }
        }
      });
      this.jobTaskService.getJobTransactionDataUpdateListener().subscribe((response) => {
        this.jobTransactionData = response;
      });
      this.jobTaskService.getAllTransactions(this.id).subscribe((response) => {
        this.jobTransactionData = response.data;
      });


    });




  }
}

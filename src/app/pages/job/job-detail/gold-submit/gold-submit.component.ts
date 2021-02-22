import {Component, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {JobTaskService} from '../../../../services/job-task.service';
import {ActivatedRoute} from '@angular/router';
import {JobMaster} from '../../../../models/jobMaster.model';
import {OrderService} from '../../../../services/order.service';
import {Material} from '../../../../models/material.model';
import {OrderMaster} from '../../../../models/orderMaster.model';
import {JobDetail} from '../../../../models/jobDetail.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../../../common/sncak-bar/sncak-bar.component';
import { __values } from 'tslib';
import {JobDetailComponent} from '../job-detail.component';
import {AuthService} from '../../../../services/auth.service';
import {JobService} from '../../../../services/job.service';

@Component({
  selector: 'app-gold-submit',
  templateUrl: './gold-submit.component.html',
  styleUrls: ['./gold-submit.component.scss']
})
export class GoldSubmitComponent implements OnInit {
  jobMasterId: number;
  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  oneJobData: JobMaster;
  public currentError: any;
  showJobTaskData = false;
  jobTaskData: JobDetail[];
  total: number;
  materialName: string;

  constructor(private jobTaskService: JobTaskService, private router: ActivatedRoute, private _snackBar: MatSnackBar) {
    // this.savedJobsData = this.jobTaskService.getAllJobList();
  }

  ngOnInit(): void {
    this.total = 0;
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.router.parent.params.subscribe(params => {
      this.jobMasterId = parseInt(params.id);
    });
    this.savedJobsData = this.jobTaskService.getAllJobList();
    this.jobTaskService.getUpdatedSavedJobs();
    this.jobTaskService.getSavedJobsUpdateListener().subscribe((response) => {
      this.savedJobsData = response;
      // console.log(this.savedJobsData);
      const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
      this.oneJobData = this.savedJobsData[index];
      this.materialName = this.oneJobData.material_name;
      // console.log(this.oneJobData);
      // this.jobTaskForm.patchValue({material_name: this.oneJobData.material_name});
      // this.jobTaskForm.value.material_name = this.oneJobData.material_name;
    });
    // const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
    // this.oneJobData = this.savedJobsData[index];
    // this.materialName = this.oneJobData.material_name;

    // this.jobTaskService.getMaterialDataUpdateListener().subscribe((response) => {
    //   this.materialData = response;
    // });
    // this.materialData = this.jobTaskService.getMaterials();
    // const matIndex = this.materialData.findIndex(x => x.id === this.oneJobData.material_id);
    // // this.returnMaterial = this.materialData[matIndex].material_name;
    // this.jobTaskForm.patchValue({material_name: this.materialData[matIndex].material_name});
    // this.jobTaskForm.patchValue({material_name: this.oneJobData.material_name});

  }

  material_quantity_decimal(){
    const x = this.jobTaskForm.value.return_quantity.split('.');
    if (!x[1]){
      this.jobTaskForm.patchValue({return_quantity : (this.jobTaskForm.value.return_quantity / 1000)});
    }
  }

  onSubmit(){
    // this.jobTaskService.getBatchCount();
    if (this.jobTaskForm.value.return_quantity === null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Please enter quantity before submit'}
      });
    }else{
      this.router.parent.params.subscribe(params => {
        this.jobMasterId = parseInt(params.id);
      });
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
      this.oneJobData = this.savedJobsData[index];
      const user = JSON.parse(localStorage.getItem('user'));
      this.jobTaskForm.patchValue({ job_Task_id: 1, material_id: this.oneJobData.material_id, id: this.jobMasterId, size: this.oneJobData.size, employee_id: user.id });
      // console.log(this.jobTaskForm.value);
      this.jobTaskForm.value.return_quantity = parseFloat(this.jobTaskForm.value.return_quantity);
      // console.log(this.jobTaskForm.value);
      // this.jobTaskService.getBatchCount(this.jobTaskForm.value.job_Task_id);
      this.jobTaskService.jobReturn().subscribe((response ) => {
        if (response.success === 1){
          this._snackBar.openFromComponent(SncakBarComponent, {
            duration: 4000, data: {message: 'Gold Submitted'}
          });
          this.total = this.total +  parseFloat(this.jobTaskForm.value.return_quantity);
          this.jobTaskService.getTotal().subscribe();
          this.jobTaskService.jobTaskData().subscribe((response) => {
            this.jobTaskData = response.data;
          });
          this.jobTaskForm.controls.return_quantity.reset();


          // console.log(this.jobTaskService.goldSendBadge);


        }
        this.currentError = null;

      }, (error) => {
        this.currentError = error;
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: error.message}
        });
      });
    }
  }

  getTotal(){
    this.total = 0;
    this.showJobTaskData = true;
    this.router.parent.params.subscribe(params => {
      this.jobMasterId = params.id;
    });
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.patchValue({ job_Task_id: 1, material_id: this.oneJobData.material_id, id: this.jobMasterId, size: this.oneJobData.size, employee_id: user.id });
    this.jobTaskService.jobTaskData().subscribe((response) => {
      this.jobTaskData = response.data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.jobTaskData.length; i++){
        this.total = this.total + this.jobTaskData[i].material_quantity;
      }
    });

  }

}

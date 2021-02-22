import { Component, OnInit } from '@angular/core';
import {JobTaskService} from '../../../../services/job-task.service';
import {FormGroup} from '@angular/forms';
import {JobMaster} from '../../../../models/jobMaster.model';
import {ActivatedRoute} from '@angular/router';
import {Material} from '../../../../models/material.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../../../common/sncak-bar/sncak-bar.component';
import {JobDetail} from '../../../../models/jobDetail.model';
import {BillService} from '../../../../services/bill.service';

@Component({
  selector: 'app-nitric-return',
  templateUrl: './nitric-return.component.html',
  styleUrls: ['./nitric-return.component.scss']
})
export class NitricReturnComponent implements OnInit {

  jobMasterId: number;
  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  oneJobData: JobMaster;
  materialData: Material[];
  returnMaterial: string;
  public currentError: any;
  showJobTaskData = false;
  jobTaskData: JobDetail[];
  total: number;

  constructor(private jobTaskService: JobTaskService, private router: ActivatedRoute, private _snackBar: MatSnackBar, private billService: BillService) { }

  ngOnInit(): void {
    this.total = 0;
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    this.router.parent.params.subscribe(params => {
      this.jobMasterId = parseInt(params.id);
    });
    const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    this.jobTaskService.getMaterialDataUpdateListener().subscribe((response) => {
      this.materialData = response;
    });
    this.materialData = this.jobTaskService.getMaterials();
    const matIndex = this.materialData.findIndex(x => x.main_material_id === this.oneJobData.material_id);
    // this.jobTaskForm.patchValue({material_name: this.materialData[matIndex].material_name});
    this.returnMaterial = this.materialData[matIndex].material_name;
    this.jobTaskService.getJobTaskDataUpdateListener().subscribe((response) => {
      this.jobTaskData = response;
    });
  }

  material_quantity_decimal(){
    const x = this.jobTaskForm.value.return_quantity.split('.');
    if (!x[1]){
      this.jobTaskForm.patchValue({return_quantity : (this.jobTaskForm.value.return_quantity / 1000)});
    }
  }

  onSubmit(){
    if (this.jobTaskForm.value.return_quantity === null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Please enter quantity before submit'}
      });
    }else {
      this.router.parent.params.subscribe(params => {
        this.jobMasterId = parseInt(params.id);
      });
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id === this.jobMasterId);
      this.oneJobData = this.savedJobsData[index];
      this.jobTaskService.getMaterialDataUpdateListener().subscribe((response) => {
        this.materialData = response;
      });
      const matIndex = this.materialData.findIndex(x => x.main_material_id === this.oneJobData.material_id);

      const user = JSON.parse(localStorage.getItem('user'));
      this.jobTaskForm.patchValue({
        job_Task_id: 7,
        material_id: this.materialData[matIndex].id,
        id: this.jobMasterId,
        size: this.oneJobData.size,
        employee_id: user.id
      });
      this.jobTaskForm.value.return_quantity = -this.jobTaskForm.value.return_quantity;
      this.jobTaskService.jobReturn().subscribe((response) => {
        if (response.success === 1) {
          this._snackBar.openFromComponent(SncakBarComponent, {
            duration: 4000, data: {message: 'Nitric Returned'}
          });
          this.total = this.total + Math.abs(parseFloat(this.jobTaskForm.value.return_quantity));
          this.jobTaskService.getTotal().subscribe();

          this.billService.getTotalGoldQuantity(this.oneJobData.id).subscribe();

          this.jobTaskService.jobTaskData().subscribe((response) => {
            this.jobTaskData = response.data;
          });
          this.jobTaskForm.controls.return_quantity.reset();
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
    // tslint:disable-next-line:max-line-length
    this.jobTaskForm.patchValue({ job_Task_id: 7, material_id: this.oneJobData.material_id, id: this.jobMasterId, size: this.oneJobData.size, employee_id: user.id });
    this.jobTaskService.jobTaskData().subscribe((response) => {
      this.jobTaskData = response.data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.jobTaskData.length; i++){
        this.total = this.total + this.jobTaskData[i].material_quantity;
      }
    });
  }
}

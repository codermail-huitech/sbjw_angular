import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import{JobTaskService} from '../../../services/job-task.service'
import {SncakBarComponent} from '../../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import {JobMaster} from 'src/app/models/jobMaster.model';
import { OrderService } from 'src/app/services/order.service';
import { Material } from 'src/app/models/material.model';
import {JobDetail} from 'src/app/models/jobDetail.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.scss']
})
export class JobTaskComponent implements OnInit {

  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  materialList: Material[];
  jobDetailsData: JobDetail[] = [];
  flag: number;
  isSendToTask = false;
  jobNumber: string;
  formTaskDiv = false;
  goldReturn = true;
  dalSubmit = true;
  dalReturn = true;
  panSubmit = true;
  panReturn = true;
  nitricReturn = true;
  sum: number;
  saveBtnName: string;
  isShowJobMasterList = true;
  constructor(private jobTaskService: JobTaskService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private orderService: OrderService ) { }

  ngOnInit(): void {
    this.isSendToTask = false;
    this.formTaskDiv = false;
    this.goldReturn = true;
    this.dalSubmit = true;
    this.dalReturn = true;
    this.panSubmit = true;
    this.panReturn = true;
    this.nitricReturn = true;
    this.sum = 0;
    this.jobTaskForm = this.jobTaskService.jobTaskForm;


    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
    });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });

  }

  onSubmit(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.value.employee_id = user.id;
    if (this.jobTaskForm.value.job_Task_id === 2 || this.jobTaskForm.value.job_Task_id === 4 || this.jobTaskForm.value.job_Task_id === 6 || this.jobTaskForm.value.job_Task_id === 7){
      this.jobTaskForm.value.return_quantity = -this.jobTaskForm.value.return_quantity;
    }
    this.jobTaskService.jobReturn();
  }
  backFunction(){
    // this.formTaskDiv = false;
    this.goldReturn = true;
    this.dalSubmit = true;
    this.dalReturn = true;
    this.panSubmit = true;
    this.panReturn = true;
    this.nitricReturn = true;
    this.jobTaskForm.reset();
    this.jobNumber = null;
    // this.jobTaskService.ngOnDestroy();
  }

  setTabData(task_id){
    this.sum = 0;
    this.jobTaskForm.patchValue({job_Task_id: task_id});
    let saveObserable = new Observable<any>();
    saveObserable = this.jobTaskService.jobTaskData();
    saveObserable.subscribe((response) => {
      this.jobDetailsData = response.data;
      for (let i = 0; i < this.jobDetailsData.length; i++) {
        console.log (this.jobDetailsData[i].material_quantity);
        this.jobDetailsData[i].material_quantity = Math.abs(this.jobDetailsData[i].material_quantity);
        this.sum = this.sum + this.jobDetailsData[i].material_quantity;
      }
    });
    if (task_id === 2){
      this.goldReturn = false;
      this.dalSubmit = true;
      this.dalReturn = true;
      this.panSubmit = true;
      this.panReturn = true;
      this.nitricReturn = true;
      this.saveBtnName = 'Save Gold Return';
    }
    if (task_id === 3){
      this.goldReturn = true;
      this.dalSubmit = false;
      this.dalReturn = true;
      this.panSubmit = true;
      this.panReturn = true;
      this.nitricReturn = true;
      this.saveBtnName = 'Save Dal Submit';
    }
    if (task_id === 4){
      this.goldReturn = true;
      this.dalSubmit = true;
      this.dalReturn = false;
      this.panSubmit = true;
      this.panReturn = true;
      this.nitricReturn = true;
      this.saveBtnName = 'Save Dal Return';
    }
    if (task_id === 5){
      this.goldReturn = true;
      this.dalSubmit = true;
      this.dalReturn = true;
      this.panSubmit = false;
      this.panReturn = true;
      this.nitricReturn = true;
      this.saveBtnName = 'Save Pan Submit';
    }
    if (task_id === 6){
      this.goldReturn = true;
      this.dalSubmit = true;
      this.dalReturn = true;
      this.panSubmit = true;
      this.panReturn = false;
      this.nitricReturn = true;
      this.saveBtnName = 'Save Pan Return';
    }
    if (task_id === 7){
      this.goldReturn = true;
      this.dalSubmit = true;
      this.dalReturn = true;
      this.panSubmit = true;
      this.panReturn = true;
      this.nitricReturn = false;
      this.saveBtnName = 'Save Nitric Return';
    }

  }

  placeDetails(data){
    this.isSendToTask = true;
    this.isShowJobMasterList = false;
   
    const index = this.materialList.findIndex(x => x.id === data.material_id);
    this.jobTaskForm.patchValue({id : data.id, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});
    this.jobNumber = data.job_number;
    
    this.setTabData(2);
    
  }
}

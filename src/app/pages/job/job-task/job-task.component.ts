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

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.scss']
})
export class JobTaskComponent implements OnInit {

  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  materialList: Material[];
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
    this.formTaskDiv = false;
    this.goldReturn = true;
    this.dalSubmit = true;
    this.dalReturn = true;
    this.panSubmit = true;
    this.panReturn = true;
    this.nitricReturn = true;
  }

  setTabData(task_id){
    this.formTaskDiv = true;
    this.jobTaskForm.patchValue({job_Task_id: task_id});
    if (task_id === 2){
      this.goldReturn = false;
      // this.jobTaskForm.patchValue({return_quantity: -(this.jobTaskForm.value.return_quantity)});
    }
    if (task_id === 3){
      this.dalSubmit = false;
    }
    if (task_id === 4){
      this.dalReturn = false;
      // this.jobTaskForm.patchValue({return_quantity: -(this.jobTaskForm.value.return_quantity)});
    }
    if (task_id === 5){
      this.panSubmit = false;
    }
    if (task_id === 6){
      this.panReturn = false;
      // this.jobTaskForm.patchValue({return_quantity: -(this.jobTaskForm.value.return_quantity)});
    }
    if (task_id === 7){
      this.nitricReturn = false;
      // this.jobTaskForm.patchValue({return_quantity: -(this.jobTaskForm.value.return_quantity)});
    }

  }

  placeDetails(data){
    this.isSendToTask = true;
    const index = this.materialList.findIndex(x => x.id === data.material_id);
    this.jobTaskForm.patchValue({id : data.id, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});
    this.jobNumber = data.job_number;
  }
}

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
  flag : number;
  isSendToTask=false;
  jobNumber : string;
  constructor(private jobTaskService: JobTaskService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private orderService: OrderService ) { }

  ngOnInit(): void {
    this.isSendToTask=false;

    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    

    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData=jobData;
    });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });

  }

  onSubmit(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.value.employee_id = user.id;
    console.log(this.jobTaskForm.value );
    this.jobTaskService.jobReturn();

  }

  placeDetails(data){
    this.isSendToTask=true;
    const index = this.materialList.findIndex(x => x.id === data.material_id);
   
    this.jobTaskForm.patchValue({id : data.id, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});
   
    this.jobNumber=data.job_number;
    
  }

  selectJobTask(data){

     this.jobTaskForm.value.job_Task_id=data;
     

  }
  selectCategory(data){
    this.jobTaskForm.value.flag=data;

  }
}

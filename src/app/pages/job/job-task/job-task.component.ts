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

  constructor(private jobTaskService: JobTaskService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private orderService: OrderService ) { }

  ngOnInit(): void {

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

    this.jobTaskService.jobReturn();

  }

  placeDetails(data){
    const index = this.materialList.findIndex(x => x.id === data.material_id);
    this.jobTaskForm.patchValue({id : data.id, approx_gold : data.approx_gold, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});
  }
}

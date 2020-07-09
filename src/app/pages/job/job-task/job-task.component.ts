import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import{JobTaskService} from '../../../services/job-task.service'
import {SncakBarComponent} from '../../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import{JobMaster} from 'src/app/models/jobMaster.model';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.scss']
})
export class JobTaskComponent implements OnInit {

  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];

  constructor(private jobTaskService : JobTaskService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {

    this.jobTaskForm = this.jobTaskService.jobTaskForm;

    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[])=>{
      this.savedJobsData=jobData;
      

    })

  }

  onSubmit(){

    console.log(this.jobTaskForm.value);

    this.jobTaskService.goldReturn(this.jobTaskForm.value);

  }

  placeDetails(data){

    console.log(data);
     
    this.jobTaskForm.patchValue({id : data.id ,approx_gold : data.approx_gold, p_loss : data.p_loss, size: data.size, price : data.price});

  }

}

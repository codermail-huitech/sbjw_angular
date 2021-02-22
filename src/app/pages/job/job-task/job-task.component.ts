import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {JobTaskService} from '../../../services/job-task.service';
import {SncakBarComponent} from '../../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import {JobMaster} from 'src/app/models/jobMaster.model';
import { OrderService } from 'src/app/services/order.service';
import { Material } from 'src/app/models/material.model';
import {JobDetail} from 'src/app/models/jobDetail.model';
import {Observable} from 'rxjs';
import {JobService} from '../../../services/job.service';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.scss']
})
export class JobTaskComponent implements OnInit {

  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[] = [];
  finishedJobsList: JobMaster[] = [];
  materialList: Material[];

  isSendToTask = false;
  jobNumber: string;
  formTaskDiv = false;

  isShowJobMasterList = true;
  showCompleteJobs = false;
  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private jobTaskService: JobTaskService , private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private orderService: OrderService , private  jobService: JobService) {

    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.showCompleteJobs = false;
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.jobService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
    });

    this.jobService.getFinishedJobsUpdateListener().subscribe((finishedjobData: JobMaster[]) => {
      this.finishedJobsList = finishedjobData;

    });

    this.savedJobsData = this.jobService.getAllJobList();
    this.finishedJobsList = this.jobService.getFinishedJobList();

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });
  }

  placeDetails(data){
    this.materialList = this.orderService.getMaterials();

    this.isSendToTask = true;
    this.isShowJobMasterList = false;

    const index = this.materialList.findIndex(x => x.id === data.material_id);
    // tslint:disable-next-line:max-line-length
    this.jobTaskForm.patchValue({id : data.id, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});
    this.jobNumber = data.job_number;
  }

  jobListShow(){
    this.showCompleteJobs = !this.showCompleteJobs;
  }
}

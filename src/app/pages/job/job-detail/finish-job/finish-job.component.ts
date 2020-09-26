import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {JobService} from "../../../../services/job.service";
import {ActivatedRoute} from "@angular/router";
import {SncakBarComponent} from "../../../../common/sncak-bar/sncak-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BillService} from "../../../../services/bill.service";
import {JobTaskService} from "../../../../services/job-task.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-finish-job',
  templateUrl: './finish-job.component.html',
  styleUrls: ['./finish-job.component.scss']
})
export class FinishJobComponent implements OnInit {
  jobMasterForm : FormGroup;
  id : number;
  constructor(private route: ActivatedRoute ,private jobService :JobService, private _snackBar: MatSnackBar, private  billService : BillService,private  jobTaskService : JobTaskService) { }

  ngOnInit(): void {
    this.jobMasterForm = this.jobService.jobMasterForm;
  }
  onSubmit(){
    if(this.jobMasterForm.value.gross_weight == null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Enter gross weight before save'}
      });
    }else{
      this.route.parent.params.subscribe(params => {
        console.log(params);
        this.id = params['id'];
        this.jobMasterForm.patchValue({id: this.id});
      });

      this.jobService.finishJob().subscribe((response)=>{

        if(response.data){
          // window.location.href = "http://localhost:4200/job_task";

          // this.jobTaskService.getUpdatedSavedJobs();
          this.jobService.getSavedJobsUpdateListener().subscribe();
          this.jobService.getFinishedJobsUpdateListener().subscribe();
          this.billService.getFinishedJobsCustomers();
          // this.billService.getUpdatedList();
          // this._snackBar.openFromComponent(SncakBarComponent, {
          //   duration: 4000, data: {message: 'Job Finished'}
          // });
          // setTimeout(function(){
          //   window.location.href = "http://localhost:4200/job_task";
          // },2000);
          Swal.fire(
            'Done !',
            'The job has been finished',
            'success'
          );

        }
      }, (error) => {
        console.log('error occured ');
        console.log(error);
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: error.message}
        });
      });
    }

  }

}

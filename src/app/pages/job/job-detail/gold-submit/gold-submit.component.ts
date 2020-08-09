import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";
import {ActivatedRoute} from "@angular/router";
import {JobMaster} from "../../../../models/jobMaster.model";
import {OrderService} from "../../../../services/order.service";
import {Material} from "../../../../models/material.model";
import {OrderMaster} from "../../../../models/orderMaster.model";
import {JobDetail} from "../../../../models/jobDetail.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SncakBarComponent} from "../../../../common/sncak-bar/sncak-bar.component";

@Component({
  selector: 'app-gold-submit',
  templateUrl: './gold-submit.component.html',
  styleUrls: ['./gold-submit.component.scss']
})
export class GoldSubmitComponent implements OnInit {

  jobMasterId : number;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  public currentError: any;

  constructor(private jobTaskService: JobTaskService,private router: ActivatedRoute,private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    // this.jobTaskForm.patchValue({return_quantity: ""});
  //   this.jobTaskForm.controls['return_quantity'].reset();
  }
  onSubmit(){
    this.jobMasterId=this.router.parent.params._value.id;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.patchValue({ job_Task_id:1, material_name: this.oneJobData.material_name, material_id: this.oneJobData.material_id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskForm.value.return_quantity= parseFloat(this.jobTaskForm.value.return_quantity);
    console.log(this.jobTaskForm.value);
    this.jobTaskService.jobReturn().subscribe((response )=>{
      
      if(response.success ===1){
        this.jobTaskForm.controls['return_quantity'].reset();
        
      
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Gold Submitted'}
        });
      }
      this.currentError = null;

    },(error) => {
      console.log('error occured ');
      console.log(error);
      this.currentError = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });

  }

}  

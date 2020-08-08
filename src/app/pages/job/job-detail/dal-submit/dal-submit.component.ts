import { Component, OnInit } from '@angular/core';
import {JobTaskService} from "../../../../services/job-task.service";
import {FormGroup} from "@angular/forms";
import {JobMaster} from "../../../../models/jobMaster.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-dal-submit',
  templateUrl: './dal-submit.component.html',
  styleUrls: ['./dal-submit.component.scss']
})
export class DalSubmitComponent implements OnInit {

  jobMasterId : number;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  constructor(private jobTaskService: JobTaskService,private router: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    // this.jobTaskForm.patchValue({return_quantity: ""});
    this.jobTaskForm.controls['return_quantity'].reset();
  }
  onSubmit(){
    this.jobMasterId=this.router.parent.params._value.id;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.patchValue({ job_Task_id:3, material_name: this.oneJobData.material_name, material_id: this.oneJobData.material_id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskForm.value.return_quantity= parseFloat(this.jobTaskForm.value.return_quantity);
    console.log(this.jobTaskForm.value);
    this.jobTaskService.jobReturn();
  }
}

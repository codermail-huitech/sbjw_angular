import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";
import {ActivatedRoute} from "@angular/router";
import {JobMaster} from "../../../../models/jobMaster.model";

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
  constructor(private jobTaskService: JobTaskService, private  router : ActivatedRoute) { }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.jobMasterId=this.router.parent.params._value.id;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    console.log(this.oneJobData);
  }
  onSubmit(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.value.employee_id = user.id;
    this.jobTaskForm.value.job_Task_id=1;
    this.jobTaskForm.value.material_id= this.oneJobData.material_id;
    this.jobTaskForm.value.id=this.oneJobData.id;
    if(this.jobTaskForm.value.job_Task_id===2 || this.jobTaskForm.value.job_Task_id===4 || this.jobTaskForm.value.job_Task_id===6 || this.jobTaskForm.value.job_Task_id===7){
      this.jobTaskForm.value.return_quantity= -this.jobTaskForm.value.return_quantity;
    }
    console.log(this.jobTaskForm.value);
    this.jobTaskService.jobReturn();
  }

}

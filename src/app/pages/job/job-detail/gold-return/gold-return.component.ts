import { Component, OnInit } from '@angular/core';
import {JobService} from "../../../../services/job.service";
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";
import {ActivatedRoute} from "@angular/router";
import {JobMaster} from "../../../../models/jobMaster.model";
import {OrderService} from "../../../../services/order.service";
import {Material} from "../../../../models/material.model";

@Component({
  selector: 'app-gold-return',
  templateUrl: './gold-return.component.html',
  styleUrls: ['./gold-return.component.scss']
})
export class GoldReturnComponent implements OnInit {

  jobMasterId : number;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;


  constructor(private jobTaskService: JobTaskService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.jobTaskForm.patchValue({return_quantity: ""});

  }

  onSubmit(){
    this.jobMasterId=this.router.parent.params._value.id;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];

    this.materialData=this.jobTaskService.getMaterials();
    const matIndex=this.materialData.findIndex(x =>x.main_material_id == this.oneJobData.material_id);
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.patchValue({ job_Task_id:2, material_name: this.materialData[matIndex].material_name, material_id: this.materialData[matIndex].id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskForm.value.return_quantity= -this.jobTaskForm.value.return_quantity;
    console.log(this.jobTaskForm.value);
    this.jobTaskService.jobReturn();
  }
}

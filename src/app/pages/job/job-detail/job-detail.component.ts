import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JobTaskService} from "../../../services/job-task.service";
import {JobMaster} from "../../../models/jobMaster.model";
import {FormGroup} from "@angular/forms";
import {OrderService} from "../../../services/order.service";
import {Material} from "../../../models/material.model";

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  sub : object;
  id : number;
  job_number : string;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  materialList: Material[];

  constructor(private route: ActivatedRoute, private jobTaskService: JobTaskService, private orderService: OrderService) {
  }

  ngOnInit(): void {
    // this.materialList = this.orderService.getMaterials();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id == this.id);
      this.oneJobData = this.savedJobsData[index];
      this.job_number = this.oneJobData.job_number;
    });

    this.jobTaskForm = this.jobTaskService.jobTaskForm;

    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
      console.log(this.savedJobsData);
      const index = this.savedJobsData.findIndex(x => x.id == this.id);
      this.oneJobData = this.savedJobsData[index];
      this.job_number = this.oneJobData.job_number;
    });


  }



}

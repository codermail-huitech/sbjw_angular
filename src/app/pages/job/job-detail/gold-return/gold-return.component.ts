import { Component, OnInit } from '@angular/core';
import {JobService} from "../../../../services/job.service";
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";

@Component({
  selector: 'app-gold-return',
  templateUrl: './gold-return.component.html',
  styleUrls: ['./gold-return.component.scss']
})
export class GoldReturnComponent implements OnInit {

  jobTaskForm: FormGroup;
  constructor(private jobTaskService: JobTaskService) { }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
  }

}

import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";

@Component({
  selector: 'app-gold-submit',
  templateUrl: './gold-submit.component.html',
  styleUrls: ['./gold-submit.component.scss']
})
export class GoldSubmitComponent implements OnInit {

  jobTaskForm: FormGroup;
  constructor(private jobTaskService: JobTaskService) { }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
  }

}

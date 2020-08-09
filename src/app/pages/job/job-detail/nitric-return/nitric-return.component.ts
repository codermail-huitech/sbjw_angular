import { Component, OnInit } from '@angular/core';
import {JobTaskService} from "../../../../services/job-task.service";
import {FormGroup} from "@angular/forms";
import {JobMaster} from "../../../../models/jobMaster.model";
import {ActivatedRoute} from "@angular/router";
import {Material} from "../../../../models/material.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SncakBarComponent} from "../../../../common/sncak-bar/sncak-bar.component";

@Component({
  selector: 'app-nitric-return',
  templateUrl: './nitric-return.component.html',
  styleUrls: ['./nitric-return.component.scss']
})
export class NitricReturnComponent implements OnInit {

  jobMasterId : number;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  materialData : Material[];
  public currentError: any;

  constructor(private jobTaskService: JobTaskService,private router: ActivatedRoute,private _snackBar: MatSnackBar) { }

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
    console.log(this.oneJobData);

    this.materialData=this.jobTaskService.getMaterials();
    const matIndex=this.materialData.findIndex(x =>x.main_material_id == this.oneJobData.material_id);

    const user = JSON.parse(localStorage.getItem('user'));
    this.jobTaskForm.patchValue({ job_Task_id:7, material_name: this.materialData[matIndex].material_name, material_id: this.materialData[matIndex].id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskForm.value.return_quantity= -this.jobTaskForm.value.return_quantity;
    console.log(this.jobTaskForm.value);
    this.jobTaskService.jobReturn().subscribe((response )=>{
      if(response.success ===1){
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Nitric Returned'}
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

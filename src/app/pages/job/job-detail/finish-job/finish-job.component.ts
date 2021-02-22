import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {JobService} from '../../../../services/job.service';
import {ActivatedRoute} from '@angular/router';
import {SncakBarComponent} from '../../../../common/sncak-bar/sncak-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BillService} from '../../../../services/bill.service';
import {JobTaskService} from '../../../../services/job-task.service';
import Swal from 'sweetalert2';
import {StockService} from '../../../../services/stock.service';

@Component({
  selector: 'app-finish-job',
  templateUrl: './finish-job.component.html',
  styleUrls: ['./finish-job.component.scss']
})
export class FinishJobComponent implements OnInit {
  jobMasterForm: FormGroup;
  id: number;
  isSubmitEnabled = true;
  constructor(private route: ActivatedRoute , private jobService: JobService, private _snackBar: MatSnackBar, private  billService: BillService, private  jobTaskService: JobTaskService, private  stockService: StockService) { }

  ngOnInit(): void {
    this.isSubmitEnabled = true;
    this.jobMasterForm = this.jobService.jobMasterForm;
  }

  material_quantity_decimal(){
    const x = this.jobMasterForm.value.gross_weight.split('.');
    if (!x[1]){
      this.jobMasterForm.patchValue({gross_weight : (this.jobMasterForm.value.gross_weight / 1000)});
    }
  }

  onSubmit(){
    if (this.jobMasterForm.value.gross_weight == null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Enter gross weight before save'}
      });
    }else {
      Swal.fire({
        title: 'Do you want to finish the job ?',
        text: 'Job  will be finished',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, finish it!',
        cancelButtonText: 'No, cancel it'
      }).then((result) => {
             if (result.value){
               this.route.parent.params.subscribe(params => {
                 this.id = params.id;
                 this.jobMasterForm.patchValue({id: this.id});
               });

               this.jobService.finishJob().subscribe((response) => {

                 if (response.data) {
                   this.jobTaskService.getTotal().subscribe();
                   this.jobService.getSavedJobsUpdateListener().subscribe();
                   this.jobService.getFinishedJobsUpdateListener().subscribe();
                   this.billService.getFinishedJobsCustomers();
                   // this.stockService.getUpdatedStockRecord();
                   this.stockService.getUpdatedStockList();
                   // this.jobTaskService.getOneJobData(this.id).subscribe((response) => {
                   //   console.log(response.data);
                   // });
                   this.jobTaskService.getOneJobData(this.id).subscribe();
                   Swal.fire(
                     'Done !',
                     'The job has been finished',
                     'success'
                   );
                   this.jobTaskService.resolve(true);
                   this.isSubmitEnabled = false;
                   this.jobMasterForm.controls.gross_weight.reset();
                 }
               }, (error) => {
                 this._snackBar.openFromComponent(SncakBarComponent, {
                   duration: 4000, data: {message: error.message}
                 });
               });
             }
             else if (result.dismiss === Swal.DismissReason.cancel) {
               Swal.fire(
                 'Cancelled',
                 'Job is not finished',
                 'error'
               );
             }
         });
      }
    }
  }

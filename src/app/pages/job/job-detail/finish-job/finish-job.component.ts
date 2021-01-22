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
  onSubmit(){
    if (this.jobMasterForm.value.gross_weight == null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Enter gross weight before save'}
      });
    }else{
      this.route.parent.params.subscribe(params => {
        this.id = params.id;
        this.jobMasterForm.patchValue({id: this.id});
      });

      this.jobService.finishJob().subscribe((response) => {

        if (response.data){
          this.jobTaskService.getTotal().subscribe();
          this.jobService.getSavedJobsUpdateListener().subscribe();
          this.jobService.getFinishedJobsUpdateListener().subscribe();
          this.billService.getFinishedJobsCustomers();
          // this.stockService.getUpdatedStockRecord();
          this.stockService.getUpdatedStockList();
          this.jobTaskService.getOneJobData(this.id).subscribe((response) => {
            console.log(response.data);
          });
          Swal.fire(
            'Done !',
            'The job has been finished',
            'success'
          );
          this.jobTaskService.resolve(true);
          this.isSubmitEnabled  = false;
          this.jobMasterForm.controls.gross_weight.reset();
        }
      }, (error) => {
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: error.message}
        });
      });
    }

  }

}

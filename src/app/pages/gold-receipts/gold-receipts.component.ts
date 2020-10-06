import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {GoldReceiptService} from "../../services/gold-receipt.service";
import {FinishedJobs} from "../../models/finishedJobs";
import {FormControl, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";
import {GoldReceipt} from "../../models/goldReceipt.model";

@Component({
  selector: 'app-gold-receipts',
  templateUrl: './gold-receipts.component.html',
  styleUrls: ['./gold-receipts.component.scss']
})
export class GoldReceiptsComponent implements OnInit {

  completedBillList : GoldReceipt[];
  goldReceivedForm : FormGroup;

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private goldReceiptService : GoldReceiptService) {
    this.completedBillList = this.goldReceiptService.getCompletedBills();

    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.goldReceiptService.getCompletedBillUpdateListener().subscribe((response)=>{
      this.completedBillList =response;
    });
    this.goldReceivedForm = this.goldReceiptService.goldReceivedForm;
  }

  fillGoldReceivedForm(data){
    this.goldReceivedForm.patchValue({bill_master_id : data.id ,customer_id : data.customer_id , agent_id : data.agent_id ,customer_name : data.customer_name,agent_name : data.agent_name});


  }

  onSubmit(){
    console.log(this.goldReceivedForm.value);
    this.goldReceivedForm.value.received_date = this.pipe.transform(this.goldReceivedForm.value.received_date, 'yyyy-MM-dd');
    this.goldReceiptService.SaveReceivedGold(this.goldReceivedForm.value).subscribe((response)=>{
      if(response.success === 1)
      {
        Swal.fire(
          'Done!',
          'Received Gold Submitted',
          'success'
        );
        this.goldReceiptService.getCompletedBillUpdateListener().subscribe((response)=>{
          this.completedBillList = response;
        });
        this.goldReceivedForm.reset();

      }
    });

  }

}

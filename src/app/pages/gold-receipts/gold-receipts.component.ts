import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {GoldReceiptService} from "../../services/gold-receipt.service";
import {FinishedJobs} from "../../models/finishedJobs";
import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-gold-receipts',
  templateUrl: './gold-receipts.component.html',
  styleUrls: ['./gold-receipts.component.scss']
})
export class GoldReceiptsComponent implements OnInit {

  completedBillList : FinishedJobs[];
  goldReceivedForm : FormGroup;

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  constructor(private goldReceiptService : GoldReceiptService) { }

  ngOnInit(): void {
    this.goldReceiptService.getCompletedBillUpdateListener().subscribe((response)=>{
      this.completedBillList =response;
    });
    this.goldReceivedForm = this.goldReceiptService.goldReceivedForm;
  }

  fillGoldReceivedForm(data){
    this.goldReceivedForm.patchValue({customer_id : data.customer_id , agent_id : data.agent_id});


  }

  onSubmit(){
    this.goldReceivedForm.value.received_date = this.pipe.transform(this.goldReceivedForm.value.received_date, 'yyyy-MM-dd');
    this.goldReceiptService.SaveReceivedGold(this.goldReceivedForm.value).subscribe();

  }

}

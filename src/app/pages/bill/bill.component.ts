import { Component, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {FinishedJobs} from "../../models/finishedJobs";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  finshedJobs : FinishedJobs[] = [];

  constructor(private  billService : BillService) { }

  ngOnInit(): void {

    this.billService.getFinishedJobsSubUpdateListener().subscribe((finishedJobs)=>{
       this.finshedJobs=finishedJobs;
       console.log(this.finshedJobs);
    })

  }

}

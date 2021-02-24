import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BillService} from "../../../services/bill.service";
import {JobMaster} from "../../../models/jobMaster.model";
import {BillMaster} from "../../../models/billMaster.model";
import {BillDetail} from "../../../models/billDetail.model";
import {FinishedJobs} from "../../../models/finishedJobs";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {float} from "html2canvas/dist/types/css/property-descriptors/float";
import toWords from 'number-to-words/src/toWords.js';
import {ExcelService} from "../../../services/excel.service";
// import toWords from 'number-to-words/src/toWords';

@Component({
  selector: 'app-completed-bill-details',
  templateUrl: './completed-bill-details.component.html',
  styleUrls: ['./completed-bill-details.component.scss']
})
export class CompletedBillDetailsComponent implements OnInit {

  finishedBillData: JobMaster[];
  billMasterData: BillMaster;
  billDetailsData: BillDetail[] = [];
  showBill = false;
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;
  discount: number;
  discountPercentage: number;


  x: FinishedJobs[];



  constructor(private  route: ActivatedRoute, private billService: BillService , private excelService: ExcelService) {}

  printDivStyle = {
    table: {'border-collapse': 'collapse', 'width' : '100%' },
    label:{'width': '100%'},
    th: {border: '1px  solid black' , 'fontSize' : 'small'}
  };

  ngOnInit(): void {
    this.total92Gold = 0;
    this.totalGold = 0;
    this.totalQuantity = 0;
    this.totalCost = 0;
    this.discount = 0;
    this.showBill = false;

    this.route.params.subscribe(params => {
      this.billService.getFinishedBillData(params['id']);
    });
    console.log(location.href);
    console.log(location.href.split('/')[3]);
    if (location.href.split('/')[3] === 'completed_bill_details'){
      this.getBillDetails(location.href.split('/')[4]);
    }

    this.billService.getfinishedBillDataSubUpdateListener()
      .subscribe((details: JobMaster[]) => {
        this.finishedBillData = details;
        // console.log(this.finishedBillData);
      });

    this.billService.showCompletedBillsDataSubUpdateListener().subscribe((response) => {
      this.showBill = true;
      this.billDetailsData = response;
      console.log(this.billDetailsData);
      this.discountPercentage = this.billDetailsData[0].discount;
      for (let i = 0; i < this.billDetailsData.length; i++){
        this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].ginnie);
        this.totalGold = this.totalGold + Number(this.billDetailsData[i].pure_gold);
        this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
        this.totalCost = this.totalCost + Number(this.billDetailsData[i].quantity * this.billDetailsData[i].rate);
        this.billDetailsData[i].LC = this.billDetailsData[i].quantity * this.billDetailsData[i].rate;
      }
      // this.discount = (this.finishedBillData[0].discount / 100) * this.totalCost;
      // this.discount = this.finishedBillData[0].discount;
      this.totalCost = this.totalCost - this.discount;
      this.discount = (this.discountPercentage / 100) * this.totalCost;
      // console.log(this.discountPercentage);
      // this.totalCost = this.totalCost - ((this.discountPercentage / 100) * this.totalCost);
    });
  }

  convert(value){
    return toWords(value);
  }

  getBillDetails(data){
    // const index = this.finishedBillData.findIndex(x => x.id === data);
    // this.discount = this.finishedBillData[index].discount;
    this.billService.showCompletedBills(data);
    // console.log();
    // const index = this.finishedBillData.findIndex(x => x.id === data);
    // this.discount = this.finishedBillData[index].discount;
  }
}

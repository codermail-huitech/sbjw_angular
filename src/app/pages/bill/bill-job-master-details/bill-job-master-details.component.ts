import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';
import {OrderDetail} from '../../../models/orderDetail.model';
import {JobMaster} from '../../../models/jobMaster.model';
import {BillMaster} from "../../../models/billMaster.model";
import {BillDetail} from "../../../models/billDetail.model";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
// import {Location} from '@angular/common';

@Component({
  selector: 'app-bill-job-master-details',
  templateUrl: './bill-job-master-details.component.html',
  styleUrls: ['./bill-job-master-details.component.scss']
})
export class BillJobMasterDetailsComponent implements OnInit {

  finishedJobData: JobMaster[];
  // billJobData: JobMaster[] = [];
  billMasterData: BillMaster;
  // billMasterData : Array<{order_master_id: number, order_number: string}> = [];
  billDetailsData: BillDetail[] = [];
  showBill = false;
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;


  constructor(private  route: ActivatedRoute, private billService: BillService) {
  }

  ngOnInit(): void {
    this.total92Gold = 0;
    this.totalGold = 0;
    this.totalQuantity = 0;
    this.totalCost = 0;
    this.showBill = false;
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.billService.getFinishedJobData(params['id']);
    });

    this.billService.getfinishedJobDataSubUpdateListener()
      .subscribe((details: JobMaster[]) => {
        this.finishedJobData = details;
        // console.log('bill_order_details');
        console.log(this.finishedJobData);
      });
  }

  // backbtn(){
  //   this.location.back();
  // }

  selectionForBill(data) {
    const index = this.billDetailsData.findIndex(x => x.id === data.id)
    if (index >= 0) {

      this.total92Gold = this.total92Gold - Number(data.total);
      this.totalGold = this.totalGold - Number(data.pure_gold);
      this.totalQuantity = this.totalQuantity - Number(data.quantity);
      this.totalCost = this.totalCost - Number(data.cost);

      this.billDetailsData.splice(index, 1);
    } else {
      console.log('data');
      console.log(data);
      this.billService.getGoldQuantity(data.id).subscribe((response) => {

        // console.log(response.data[0].total);
        data.total = response.data[0].total.toFixed(3);
        data.pure_gold = ((data.total * 92) / 100).toFixed(3);
        data.cost = data.price * data.quantity;

        this.total92Gold = this.total92Gold + Number(data.total);
        this.totalGold = this.totalGold + Number(data.pure_gold);
        this.totalQuantity = this.totalQuantity + Number(data.quantity);
        this.totalCost = this.totalCost + Number(data.cost);
        this.billDetailsData.push(data);

        console.log('response');
        console.log(this.billDetailsData);
      });

      // this.billDetailsData.push(data);
    }
    // console.log(this.billDetailsData);
  }

  generateBill() {
    // const x= this.billDetailsData[0];
    // this.showBill = true;
    // console.log(this.billDetailsData);
    const x = new Date();
    let billDate =  x.getFullYear() + '-' + parseInt(x.getMonth() +1) + '-' + x.getDate()
      if (this.billDetailsData[0]) {
        // const x = this.billDetailsData[0];
        this.billMasterData = {
          order_master_id: this.billDetailsData[0].order_master_id,
          order_number: this.billDetailsData[0].order_number,
          person_name: this.billDetailsData[0].person_name,
          address1: this.billDetailsData[0].address1,
          mobile1: this.billDetailsData[0].mobile1,
          pin: this.billDetailsData[0].pin,
          area: this.billDetailsData[0].area,
          city: this.billDetailsData[0].city,
          state: this.billDetailsData[0].state,
          po: this.billDetailsData[0].po,
          date_of_order: this.billDetailsData[0].date_of_order,
          karigarh_id: this.billDetailsData[0].karigarh_id,
          customer_id: this.billDetailsData[0].customer_id,
          bill_date: billDate,
          discount: 0
        };
      }
      this.billService.saveBillMaster(this.billMasterData, this.billDetailsData).subscribe((response) => {
        this.billMasterData = {
          order_master_id: this.billDetailsData[0].order_master_id,
          order_number: this.billDetailsData[0].order_number,
          person_name: this.billDetailsData[0].person_name,
          address1: this.billDetailsData[0].address1,
          mobile1: this.billDetailsData[0].mobile1,
          pin: this.billDetailsData[0].pin,
          area: this.billDetailsData[0].area,
          city: this.billDetailsData[0].city,
          state: this.billDetailsData[0].state,
          po: this.billDetailsData[0].po,
          date_of_order: this.billDetailsData[0].date_of_order,
          karigarh_id: this.billDetailsData[0].karigarh_id,
          customer_id: this.billDetailsData[0].customer_id,
          bill_date: billDate,
          discount: 0,
          billNumber: response.data.bill_number
        }
        console.log( this.billMasterData);
        this.showBill = true;
      });


  }


}

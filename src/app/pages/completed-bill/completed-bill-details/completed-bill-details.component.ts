import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BillService} from "../../../services/bill.service";
import {JobMaster} from "../../../models/jobMaster.model";
import {BillMaster} from "../../../models/billMaster.model";
import {BillDetail} from "../../../models/billDetail.model";
import {FinishedJobs} from "../../../models/finishedJobs";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {float} from "html2canvas/dist/types/css/property-descriptors/float";

@Component({
  selector: 'app-completed-bill-details',
  templateUrl: './completed-bill-details.component.html',
  styleUrls: ['./completed-bill-details.component.scss']
})
export class CompletedBillDetailsComponent implements OnInit {

  finishedBillData: JobMaster[];
  // billJobData: JobMaster[] = [];
  billMasterData: BillMaster;
  // billMasterData : Array<{order_master_id: number, order_number: string}> = [];
  billDetailsData: BillDetail[] = [];
  showBill = false;
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;



  x : FinishedJobs[];

  constructor(private  route: ActivatedRoute, private billService: BillService) {}

  printDivStyle = {
    // printDiv: {marginRight : '5px', marginLeft : '5px', marginTop : '5px'},
    table: {'border-collapse': 'collapse', 'width' : '100%'},
    label:{'width': '100%'},
    h1 : {color: 'red'},
    h2 : {border: 'solid 1px'},
    td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };

  ngOnInit(): void {
    this.total92Gold = 0;
    this.totalGold = 0;
    this.totalQuantity = 0;
    this.totalCost = 0;
    this.showBill = false;
    console.log("testing");
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.billService.getFinishedBillData(params['id']);
    });

    this.billService.getfinishedBillDataSubUpdateListener()
      .subscribe((details: JobMaster[]) => {
        this.finishedBillData = details;
        console.log(this.finishedBillData);
      });

    this.billService.showCompletedBillsDataSubUpdateListener()
      .subscribe((details: BillDetail[]) => {
        this.showBill = true;
        // console.log(details);
        this.billDetailsData = details;
        console.log('billDetailsData 1');
        console.log(this.billDetailsData);
        console.log(this.billDetailsData.length);

        for(let i =0; i<this.billDetailsData.length; i++){
          console.log('testcheck');
          console.log(i);
          this.billService.getGoldQuantity(this.billDetailsData[i].id).subscribe((response)=>{
            this.billDetailsData[i].total = response.data[0].total.toFixed(3);
            // this.billDetailsData[i].pure_gold = ((this.billDetailsData[i].total * 92) / 100);
            this.billDetailsData[i].pure_gold =Number((this.billDetailsData[i].total * 92 / 100).toFixed(3));
            this.billDetailsData[i].cost = this.billDetailsData[i].price * this.billDetailsData[i].quantity;

            this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].total);
            this.totalGold = this.totalGold + Number(this.billDetailsData[i].pure_gold);
            this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
            this.totalCost = this.totalCost + Number(this.billDetailsData[i].cost);
          });

        }
        // console.log('test');
        // console.log(this.billDetailsData);

      });

  }
  // selectionForBill(data) {
  //   const index = this.billDetailsData.findIndex(x => x.id === data.id)
  //   console.log("billDetailsData");
  //   console.log(this.billDetailsData[index]);
  //   if (index >= 0) {
  //
  //     this.total92Gold = this.total92Gold - Number(data.total);
  //     this.totalGold = this.totalGold - Number(data.pure_gold);
  //     this.totalQuantity = this.totalQuantity - Number(data.quantity);
  //     this.totalCost = this.totalCost - Number(data.cost);
  //
  //     this.billDetailsData.splice(index, 1);
  //      } else {
  //     this.billService.getGoldQuantity(data.id).subscribe((response) => {
  //
  //       // console.log(response.data[0].total);
  //       data.total = response.data[0].total.toFixed(3);
  //       data.pure_gold = ((data.total * 92) / 100).toFixed(3);
  //       data.cost = data.price * data.quantity;
  //
  //       this.total92Gold = this.total92Gold + Number(data.total);
  //       this.totalGold = this.totalGold + Number(data.pure_gold);
  //       this.totalQuantity = this.totalQuantity + Number(data.quantity);
  //       this.totalCost = this.totalCost + Number(data.cost);
  //       this.billDetailsData.push(data);
  //     });
  //
  //     // this.billDetailsData.push(data);
  //   }
  //   // console.log(this.billDetailsData);
  // }

  getBillDetails(data){
    // console.log(data);
    this.billService.showCompletedBills(data);
    // this.billService.showCompletedBillsDataSubUpdateListener()
    //   .subscribe((details: BillDetail[]) => {
    //     this.showBill = true;
    //     this.billDetailsData = details;
    //     for(let i =0; i<this.billDetailsData.length; i++){
    //      this.billService.getGoldQuantity(this.billDetailsData[i].id).subscribe((response)=>{
    //         this.billDetailsData[i].total = response.data[0].total.toFixed(3);
    //         this.billDetailsData[i].pure_gold = parseFloat(((this.billDetailsData[i].total * 92) / 100).toFixed(3));
    //         this.billDetailsData[i].cost = parseFloat((this.billDetailsData[i].price * this.billDetailsData[i].quantity).toFixed(3));
    //
    //         this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].total);
    //         this.totalGold = this.totalGold + Number(this.billDetailsData[i].pure_gold);
    //         this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
    //         this.totalCost = this.totalCost + Number(this.billDetailsData[i].cost);
    //       });
    //
    //     }
    //
    //   });
  }

  // generateBill() {
  //   // const x= this.billDetailsData[0];
  //   // this.showBill = true;
  //   // console.log(this.billDetailsData);
  //   const x = new Date();
  //   // let billDate =  x.getFullYear() + '-' + parseInt(x.getMonth() +1) + '-' + x.getDate();
  //   // console.log(billDate);
  //   // console.log(this.billDetailsData[0]);
  //   if (this.billDetailsData[0]) {
  //     this.billMasterData = {
  //       order_master_id: this.billDetailsData[0].order_master_id,
  //       orderNumber: this.billDetailsData[0].orderNumber,
  //       personName: this.billDetailsData[0].person_name,
  //       address1: this.billDetailsData[0].address1,
  //       mobile1: this.billDetailsData[0].mobile1,
  //       pin: this.billDetailsData[0].pin,
  //       area: this.billDetailsData[0].area,
  //       city: this.billDetailsData[0].city,
  //       state: this.billDetailsData[0].state,
  //       po: this.billDetailsData[0].po,
  //       orderDate: this.billDetailsData[0].date_of_order,
  //       karigarhId: this.billDetailsData[0].karigarh_id,
  //       customerId: this.billDetailsData[0].customer_id,
  //       billDate:  x.getFullYear() + '-' + parseInt(String(x.getMonth() + 1)) + '-' + x.getDate(),
  //       discount: 0
  //     };
  //     console.log(this.billMasterData);
  //   }
  //   this.billService.saveBillMaster(this.billMasterData, this.billDetailsData).subscribe((response) => {
  //     this.billMasterData = {
  //       order_master_id: this.billDetailsData[0].order_master_id,
  //       orderNumber: this.billDetailsData[0].order_number,
  //       personName: this.billDetailsData[0].person_name,
  //       address1: this.billDetailsData[0].address1,
  //       mobile1: this.billDetailsData[0].mobile1,
  //       pin: this.billDetailsData[0].pin,
  //       area: this.billDetailsData[0].area,
  //       city: this.billDetailsData[0].city,
  //       state: this.billDetailsData[0].state,
  //       po: this.billDetailsData[0].po,
  //       orderDate: this.billDetailsData[0].date_of_order,
  //       karigarhId: this.billDetailsData[0].karigarh_id,
  //       customerId: this.billDetailsData[0].customer_id,
  //       billDate:  x.getFullYear() + '-' + parseInt(String(x.getMonth() + 1)) + '-' + x.getDate(),
  //       discount: 0,
  //       billNumber:response.data.bill_number
  //     };
  //     this.billService.getUpdatedList();
  //     this.showBill = true;
  //   });
  // }

}

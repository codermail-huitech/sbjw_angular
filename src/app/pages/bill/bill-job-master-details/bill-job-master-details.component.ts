import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';
import {OrderDetail} from '../../../models/orderDetail.model';
import {JobMaster} from '../../../models/jobMaster.model';
import {BillMaster} from "../../../models/billMaster.model";
import {BillDetail} from "../../../models/billDetail.model";
// import {Location} from '@angular/common';

@Component({
  selector: 'app-bill-job-master-details',
  templateUrl: './bill-job-master-details.component.html',
  styleUrls: ['./bill-job-master-details.component.scss']
})
export class BillJobMasterDetailsComponent implements OnInit {

  finishedJobData : JobMaster[];
  // billJobData : JobMaster[] = [];
  billMasterData : BillMaster;
  // billMasterData : Array<{order_master_id: number, order_number: string}> = [];
  billDetailsData : BillDetail[]=[];
  showBill = false;


  constructor(private  route : ActivatedRoute, private billService : BillService)  { }
  ngOnInit(): void {
    this.showBill =false;
    this.route.params.subscribe(params => {
       // console.log(params['id']);
      this.billService.getFinishedJobData(params['id']);
    });

    this.billService.getfinishedJobDataSubUpdateListener()
      .subscribe((details: JobMaster[]) => {
        this.finishedJobData = details;
        // console.log('bill_order_details');
        console.log(this.finishedJobData );
      });
  }
  // backbtn(){
  //   this.location.back();
  // }

  selectionForBill(data){
    const index = this.billDetailsData.findIndex(x=>x.id === data.id)
    if(index >= 0){
      this.billDetailsData.splice(index,1);
    }else{
      console.log('data');
      console.log(data);
      this.billService.getGoldQuantity(data.id).subscribe((response)=>{

        // console.log(response.data[0].total);
        data.total = response.data[0].total.toFixed(3);
        data.pure_gold = ((data.total*92)/100).toFixed(3);
        this.billDetailsData.push(data);

        console.log('response');
        console.log(this.billDetailsData);
      });

      // this.billDetailsData.push(data);
    }
    // console.log(this.billDetailsData);
  }
  generateBill(){
    // const x= this.billDetailsData[0];
    this.showBill = true;
    this.billMasterData = {
      order_master_id : this.billDetailsData[0].order_master_id,
      order_number : this.billDetailsData[0].order_number,
      person_name : this.billDetailsData[0].person_name,
      address1 : this.billDetailsData[0].address1,
      mobile1 : this.billDetailsData[0].mobile1,
      pin : this.billDetailsData[0].pin,
      area : this.billDetailsData[0].area,
      city : this.billDetailsData[0].city,
      state : this.billDetailsData[0].state,
      po : this.billDetailsData[0].po,
      date_of_order : this.billDetailsData[0].date_of_order
    }


    console.log('test');
    console.log(this.billMasterData);
    console.log(this.billDetailsData);
  }


}

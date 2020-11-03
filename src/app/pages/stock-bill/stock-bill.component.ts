import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {Stock} from '../../models/stock.model';
import {BillService} from '../../services/bill.service';
import {BillMaster} from '../../models/billMaster.model';
import {BillDetail} from '../../models/billDetail.model';

@Component({
  selector: 'app-stock-bill',
  templateUrl: './stock-bill.component.html',
  styleUrls: ['./stock-bill.component.scss']
})
export class StockBillComponent implements OnInit {
  stockList: Stock[];
  billMasteritem: BillMaster;
  billDetailsData: BillDetail[] = [];
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;
  constructor(private  stockService: StockService , private  billService: BillService) {
    this.stockList = this.stockService.getStockList();
    // this.stockList.forEach(function(value){
    //   const x = value.tag.split('-');
    //   // tslint:disable-next-line:radix
    //   value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
    // });
  }

  ngOnInit(): void {
    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      this.stockList.forEach(function(value){
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
    });
  }


  stockSelectionForBill(item){
    const index = this.billDetailsData.findIndex(x => x.id === item.id);
    if(index >= 0)
    {
       this.billDetailsData.splice(index,1);
    }
    else {
      this.billService.getGoldQuantity(item.job_master_id).subscribe((response) => {

        // console.log(response.data[0].total);
        item.total = response.data[0].total.toFixed(3);
        item.pure_gold = ((item.total * 92) / 100).toFixed(3);
        item.cost = item.price * item.quantity;

        this.total92Gold = this.total92Gold + Number(item.total);
        this.totalGold = this.totalGold + Number(item.pure_gold);
        this.totalQuantity = this.totalQuantity + Number(item.quantity);
        this.totalCost = this.totalCost + Number(item.cost);
        this.billDetailsData.push(item);

        console.log('response');
        console.log(this.billDetailsData);
      });
    }
    console.log('billDetailsData');
    console.log(this.billDetailsData);
  }
}

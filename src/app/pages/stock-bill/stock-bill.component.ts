import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {Stock} from '../../models/stock.model';
import {BillService} from '../../services/bill.service';
import {BillMaster} from '../../models/billMaster.model';
import {BillDetail} from '../../models/billDetail.model';
import {StorageMap} from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-stock-bill',
  templateUrl: './stock-bill.component.html',
  styleUrls: ['./stock-bill.component.scss']
})
export class StockBillComponent implements OnInit {
  stockList: Stock[];
  billMasterData: BillMaster;
  billDetailsData: BillDetail[] = [];
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;
  searchTag: string;
  stockBillContainer: any;

  constructor(private  stockService: StockService, private  billService: BillService, private  storage: StorageMap) {
    this.stockList = this.stockService.getStockList();
  }

  ngOnInit(): void {
    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      // tslint:disable-next-line:only-arrow-functions
      this.stockList.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
    });

    this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
      if (stockBillContainer) {
        this.billDetailsData = stockBillContainer.stockBillDetailsData;
      }
    }, (error) => {
    });
  }
  stockSelectionForBill(item) {

    const index = this.billDetailsData.findIndex(x => x.id === item.id);
    if (index === -1){

      item.total = item.gold;
      item.cost = item.amount;

      item.pure_gold = parseFloat(((item.total * 92) / 100).toFixed(3));

      this.total92Gold = this.total92Gold + Number(item.total);
      this.totalGold = this.totalGold + Number(item.pure_gold);

      this.billDetailsData.push(item);
      item.isSet = true;
    }

    // item.total = item.gold;
    // item.cost = item.amount;
    // console.log(item);

    // item.pure_gold = parseFloat(((item.total * 92) / 100).toFixed(3));
    //
    // this.total92Gold = this.total92Gold + Number(item.total);
    // this.totalGold = this.totalGold + Number(item.pure_gold);
    //
    // this.billDetailsData.push(item);
    console.log(this.billDetailsData);
    this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
      };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
  }

  removeFromStockBillEntry(item){
    console.log(this.billDetailsData);
    const index = this.billDetailsData.findIndex(x => x.id === item.id);
    this.total92Gold = this.total92Gold - Number(item.total);
    this.totalGold = this.totalGold - Number(item.pure_gold);

    this.billDetailsData.splice(index, 1);
    item.isSet = false;
    console.log(this.billDetailsData);
    this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
      };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
  }

  stockBillGenerate(){
    console.log(this.billDetailsData);
    // this.billService.testBillSave(this.billDetailsData).subscribe();
  }
}

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
  billMasteritem: BillMaster;
  billDetailsData: BillDetail[] = [];
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;
  searchTag: string;
  stockBillContainer: any;
  isSelectEnabled = true;

  constructor(private  stockService: StockService, private  billService: BillService, private  storage: StorageMap) {
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
    if (index >= 0) {
      this.billDetailsData.splice(index, 1);
      this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
      };
    } else {
      this.billDetailsData.push(item);
      this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
      };
    }
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
  }
}

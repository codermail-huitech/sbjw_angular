import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {Stock} from '../../models/stock.model';
import {BillService} from '../../services/bill.service';
import {BillMaster} from '../../models/billMaster.model';
import {BillDetail} from '../../models/billDetail.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer.model';
import toWords from 'number-to-words/src/toWords';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-bill',
  templateUrl: './stock-bill.component.html',
  styleUrls: ['./stock-bill.component.scss']
})
export class StockBillComponent implements OnInit {
  stockList: Stock[];
  billMasterData: BillMaster;
  // billDetailsData: BillDetail[]  = [];
  billDetailsData: BillDetail[] = [];
  total92Gold: number;
  totalGold: number;
  totalQuantity: number;
  totalCost: number;
  searchTag: string;
  stockBillContainer: any;
  billView = true ;
  customerData: Customer[];
  selectedCustomerData: Customer;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  bill_date: string;

  constructor(private customerService: CustomerService, private  stockService: StockService, private  billService: BillService, private  storage: StorageMap) {
    this.stockList = this.stockService.getStockList();
    this.customerData = this.customerService.getCustomers();
    // this.selectedCustomerData = this.customerData[0];
    this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
      if (stockBillContainer){
        // console.log(stockBillContainer);
        if  (stockBillContainer.stockBillDetailsData) {
          this.billDetailsData = stockBillContainer.stockBillDetailsData;
        }
        if (stockBillContainer.stockBillCustomer){
          this.selectedCustomerData  = stockBillContainer.stockBillCustomer;
        }

        for (let i = 0; i < this.billDetailsData.length; i++ ){
          const index = this.stockList.findIndex(x => x.id === this.billDetailsData[i].id);
          this.stockList[index].isSet = true;
          // console.log(this.stockList[index]);

          // this.stockList[i].total = Number(this.stockList[i].gold);
          // this.stockList[i].cost = this.stockList[i].amount;

          const pure_gold = parseFloat(((this.billDetailsData[i].total * 92) / 100).toFixed(3));
          this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].total);
          this.totalGold = this.totalGold + Number(pure_gold);
          this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
          this.totalCost = this.totalCost + this.billDetailsData[i].amount;
        }
      }
    });
  }
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



    this.customerData = this.customerService.getCustomers();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerData = customers;
        this.selectedCustomerData = this.customerData[0];
        // console.log(this.selectedCustomerData);
      });

    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      // console.log(this.stockList);
      // tslint:disable-next-line:only-arrow-functions
      this.stockList.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });


      this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
        // this.customerData = stockBillContainer.stockBillCustomer;
      // public fields: Object = { text: 'Country.Name', value: 'Code.Id' };
        console.log('stockBillContainer');
        console.log(stockBillContainer);
        if (stockBillContainer) {
          this.total92Gold = 0;
          this.totalGold = 0;
          this.totalQuantity = 0;
          this.totalCost = 0;

          if  (stockBillContainer.stockBillDetailsData) {
            this.billDetailsData = stockBillContainer.stockBillDetailsData;
          }
          // this.selectedCustomerData =  stockBillContainer.stockBillCustomer;
          if (stockBillContainer.stockBillCustomer){
            this.selectedCustomerData =  stockBillContainer.stockBillCustomer;
          }
          // console.log(stockBillContainer.stockBillCustomer);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.billDetailsData.length; i++ ){
            const index = this.stockList.findIndex(x => x.id === this.billDetailsData[i].id);
            this.stockList[index].isSet = true;
            // console.log(this.stockList[index]);

            // this.stockList[i].total = Number(this.stockList[i].gold);
            // this.stockList[i].cost = this.stockList[i].amount;

            const pure_gold = parseFloat(((this.billDetailsData[i].total * 92) / 100).toFixed(3));
            this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].total);
            this.totalGold = this.totalGold + Number(pure_gold);
            this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
            this.totalCost = this.totalCost + this.billDetailsData[i].amount;
          }
        }
      }, (error) => {
      });
      // localStorage.removeItem('stockBillContainer');

    });


    // this.stockList = this.stockService.getStockList();
    // this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
    //   if (stockBillContainer) {
    //     this.billDetailsData = stockBillContainer.stockBillDetailsData;
    //     console.log('stockBillContainer');
    //     console.log(this.stockList);
    //     // this.billDetailsData.forEach(function(value) {
    //     //
    //     // });
    //   }
    // }, (error) => {
    // });
  }

  convert(value){
    return toWords(value);
  }

  stockSelectionForBill(item) {


    // this.billDetailsData.push(item);
    // console.log(this.billDetailsData);


    const index = this.billDetailsData.findIndex(x => x.id === item.id);
    if (index === -1){

      item.total = item.gold;
      item.cost = item.amount;

      item.pure_gold = parseFloat(((item.total * 92) / 100).toFixed(3));


      this.total92Gold = this.total92Gold + Number(item.total);
      this.totalGold = this.totalGold + Number(item.pure_gold);
      this.totalQuantity = this.totalQuantity + Number(item.quantity);
      this.totalCost = this.totalCost + item.amount;

      this.billDetailsData.push(item);
      // console.log(this.billDetailsData);
      item.isSet = true;
    }

    // this.billDetailsData.push(item);
    // console.log(this.billDetailsData);

    // item.total = item.gold;
    // item.cost = item.amount;
    // console.log(item);
    //
    // item.pure_gold = parseFloat(((item.total * 92) / 100).toFixed(3));
    //
    // this.total92Gold = this.total92Gold + Number(item.total);
    // this.totalGold = this.totalGold + Number(item.pure_gold);
    //
    // // this.billDetailsData.push(item);
    // console.log(this.billDetailsData);
    // console.log(this.total92Gold);
    // console.log(this.totalGold);

    this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
        stockBillCustomer: this.selectedCustomerData,
      };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
  }

  // clearStorage(){
  //   localStorage.removeItem('stockBillContainer');
  // }


  removeFromStockBillEntry(item){
    // console.log(this.billDetailsData);
    const index = this.billDetailsData.findIndex(x => x.id === item.id);
    const stockListIndex = this.stockList.findIndex(x => x.id === item.id);
    this.total92Gold = this.total92Gold - Number(item.total);
    this.totalGold = this.totalGold - Number(item.pure_gold);
    this.totalQuantity = this.totalQuantity - Number(item.quantity);
    this.totalCost = this.totalCost - item.amount;

    this.billDetailsData.splice(index, 1);
    this.stockList[stockListIndex].isSet = false;
    // console.log(this.billDetailsData);
    this.stockBillContainer = {
        stockBillDetailsData: this.billDetailsData,
        stockBillCustomer: this.selectedCustomerData,
      };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
  }

  stockBillGenerate(){
    // console.log(this.billDetailsData);
    Swal.fire({
      title: 'Do you want to generate bill ?',
      text: 'Bill  will be generated',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel it'
    }).then((result) => {
      // this.billService.testBillSave(this.billDetailsData).subscribe();
    });
    // this.billService.testBillSave(this.billDetailsData).subscribe();
  }
  ViewBill(){
    this.billView = false;
    // console.log(this.billDetailsData);
  }
  backBtn(){
    this.billView = true;
  }
  customerSelected(data){
    // let date = "2020-12-20";
    // data.bill_date = "2020-12-20";
    data.bill_date = this.selectedCustomerData.bill_date;
    this.selectedCustomerData = data;
    this.stockBillContainer = {
      stockBillDetailsData: this.billDetailsData,
      stockBillCustomer: this.selectedCustomerData,
    };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });

    // console.log(this.stockBillContainer);
  }
  getDate(date){
    console.log(date);
  }
}

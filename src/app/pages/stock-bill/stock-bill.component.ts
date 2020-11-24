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
import {DatePipe, formatDate} from '@angular/common';
import {AgentService} from '../../services/agent.service';
import {Agent} from '../../models/agent.model';

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
  // agentName: string;
  stockBillContainer: any;
  billView = true ;
  customerData: Customer[];
  selectedCustomerData: Customer;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  bill_date: string;
  pipe = new DatePipe('en-US');
  agentData: Agent[]  ;
  tempStockList: Stock[];
  date = new Date();

  page: number;
  pageSize: number;
  p = 1;

  // now = Date.now();

  constructor(private customerService: CustomerService, private  stockService: StockService, private  billService: BillService, private  storage: StorageMap, private agentService: AgentService) {
    console.log('constructor invoked');
    // this.agentData = this.agentService.getAgentList();
    this.stockList = this.stockService.getStockList();
    // if (this.stockList){
    //   this.stockList.forEach(function(value) {
    //     const x = value.tag.split('-');
    //     // tslint:disable-next-line:radix
    //     value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
    //   });
    // }
    this.tempStockList = this.stockList.filter(x => x.agent_id === 2);
    this.page = 1;
    this.pageSize = 10;
    this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
      if (stockBillContainer){
        if (stockBillContainer.stockBillDetailsData) {
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
    // this.bill_date = '20/11/2020';
    // this.bill_date = '2020-11-20';

    this.billMasterData = {
      billNumber : null,
      customerId : 0,
      agent_id: 0,
      discount: 0,
      billDate: '0',
    };

    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      this.stockList.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
      this.tempStockList = this.stockList.filter(x => x.agent_id === 2);


      this.storage.get('stockBillContainer').subscribe((stockBillContainer: any) => {
        console.log(stockBillContainer);
        if (stockBillContainer) {
          this.total92Gold = 0;
          this.totalGold = 0;
          this.totalQuantity = 0;
          this.totalCost = 0;
          // console.log(stockBillContainer);
          if  (stockBillContainer.stockBillDetailsData != null) {
            this.billDetailsData = stockBillContainer.stockBillDetailsData;
            for (let i = 0; i < this.billDetailsData.length; i++ ){
              const index = this.stockList.findIndex(x => x.id === this.billDetailsData[i].id);
              this.stockList[index].isSet = true;


              const pure_gold = parseFloat(((this.billDetailsData[i].total * 92) / 100).toFixed(3));
              this.total92Gold = this.total92Gold + Number(this.billDetailsData[i].total);
              this.totalGold = this.totalGold + Number(pure_gold);
              this.totalQuantity = this.totalQuantity + Number(this.billDetailsData[i].quantity);
              this.totalCost = this.totalCost + this.billDetailsData[i].amount;
            }
          }

          if (stockBillContainer.stockBillCustomer){
            this.selectedCustomerData =  stockBillContainer.stockBillCustomer;
          }


        }
      }, (error) => {
      });
      // localStorage.removeItem('stockBillContainer');

    });

    this.customerData = this.customerService.getCustomers();
    // this.agentData = this.agentService.getAgentList();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerData = customers;
        this.selectedCustomerData = this.customerData[0];
        // this.selectedCustomerData.bill_date = '2010-11-02';
        this.selectedCustomerData.bill_date = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();;
        // console.log(formatDate(this.date.getDate(), 'yyyy-MM-dd', 'en'));
        // this.selectedCustomerData.bill_date = this. datepipe. transform(this.date, 'yyyy-MM-dd');
        // console.log(this.date);
      });

    this.agentService.getAgentUpdateListener()
      .subscribe((response) => {
        this.agentData = response;
        console.log('agentData');
        console.log(this.agentData);
      });
    this.agentData = this.agentService.getAgentList();




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

  clearStorage(){
    // console.log(this.stockBillContainer);
    // this.billDetailsData = [];
    // localStorage.removeItem('stockBillContainer');
    // console.log(this.stockBillContainer);
    // for (let i = 0 ; i < this.stockList.length ; i ++){
    //   this.stockList[i].isSet = false;
    // }
    this.selectedCustomerData = this.customerData[0];
    this.selectedCustomerData.bill_date = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();

    this.stockBillContainer = {
      stockBillDetailsData: null,
      stockBillCustomer: null,
    };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
    this.billDetailsData = [];
    this.selectedCustomerData = null;

  }


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
      this.billMasterData = {
        billNumber : null,
        customerId : this.selectedCustomerData.id,
        agent_id: this.billDetailsData[0].agent_id,
        discount: 0,
        billDate: this.selectedCustomerData.bill_date,
      };

      this.billService.saveBillMaster(this.billMasterData, this.billDetailsData).subscribe((response) => {
        if (response.data){
          // console.log(response.data);
          this.billMasterData.bill_number = response.data.bill_number;
          // this.stockBillContainer = null;
          // this.stockService.getUpdatedStockList();
          for(let i = 0; i < this.billDetailsData.length; i++){
            const index = this.stockList.findIndex(x => x.id === this.billDetailsData[i].id);
            this.stockList.splice(index,1);
          }
        }
      });
    });
    // this.billService.testBillSave(this.billDetailsData).subscribe();
  }
  ViewBill(){
    console.log(this.billMasterData);
    this.billView = false;
    // console.log(this.billDetailsData);
  }
  backBtn(){
    this.billView = true;
  }
  customerSelected(data){
    // let date = "2020-12-20";
    // data.bill_date = "2020-12-20";
    // console.log(this.selectedCustomerData.bill_date);

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

  getStockListByAgentName(item){
    console.log(item);
    console.log(this.stockList);
    this. tempStockList = this.stockList.filter(x => x.agent_id === item);
    // console.log(this.tempStockList);
  }
  selectDate(item){
    const date =  item.getFullYear() + '-' + parseInt(String(item.getMonth() + 1)) + '-' + item.getDate();

    this.selectedCustomerData.bill_date = date;
    this.stockBillContainer = {
      stockBillDetailsData: this.billDetailsData,
      stockBillCustomer: this.selectedCustomerData,
    };
    this.storage.set('stockBillContainer', this.stockBillContainer).subscribe(() => {
    });
    // console.log(this.stockBillContainer);
  }
}

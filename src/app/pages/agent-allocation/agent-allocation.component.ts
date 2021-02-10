import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {AgentService} from '../../services/agent.service';
import {Stock} from '../../models/stock.model';
import {Agent} from '../../models/agent.model';
import Swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-agent-allocation',
  templateUrl: './agent-allocation.component.html',
  styleUrls: ['./agent-allocation.component.scss']
})
export class AgentAllocationComponent implements OnInit {

  public searchTerm: string;
  public selected = [];
  stockList: Stock[];
  billDetailsData: Stock[] = [];
  agentData: Agent[];
  singleAgent: Agent = null;
  page: number;
  pageSize: number;
  p = 1;
  showCheckbox = false;
  stockDeallocation: Stock[] = [];
  tempStorageBillDetailsData: Stock[] = [];
  isChecked = false;

  constructor(private stockService: StockService, private agentService: AgentService, private _snackBar: MatSnackBar) {
    this.stockList = this.stockService.getStockList();
    this.page = 1;
    this.pageSize = 10;
    // this.agentData = this.agentService.getAgentList();
    this.stockList.forEach(function(value){
      if (value.agent_id === 2 && value.in_stock === 1) {
        // value.isSet = false;
        value.isAgentSet = false;
      }else{
        // value.isSet = true;
        value.isAgentSet = true;
      }
    });
  }

  ngOnInit(): void {
    this.showCheckbox = false;
    this.isChecked = false;
    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      // const tempData = this.stockList.filter(x => x.in_stock === 1);
      this.stockList.forEach(function(value){
        if (value.agent_id === 2 && value.in_stock === 1) {
          // value.isSet = false;
          value.isAgentSet = false;
        }else{
          // value.isSet = true;
          value.isAgentSet = true;
        }
      });
      // tslint:disable-next-line:only-arrow-functions
      // this.stockList.forEach(function(value) {
      //   const x = value.tag.split('-');
      //   // tslint:disable-next-line:radix
      //   value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      // });
    });

    this.agentService.getAgentUpdateListener().subscribe((response) => {
      this.agentData = response;
      this.singleAgent = this.agentData[0];
    });
    this.agentData = this.agentService.getAgentList();
    if(this.agentData){
      this.singleAgent = this.agentData[0];
    }

  }

  updateStockAgent(){
    this.stockService.updateStockByAgent(this.billDetailsData, this.singleAgent.id)
      .subscribe((response: {success: number, data: Stock[]}) => {
        if (response.data){
          Swal.fire({
            title: 'Allocated',
            text: 'Stock allocated to agent',
            icon: 'success',
          });
          this.billDetailsData = [];
          this.tempStorageBillDetailsData = [];
          // this.agentService.getLatestAgent();
          this.stockService.getUpdatedStockList();
        }
    });
  }

  searchStocks(){
    this.showCheckbox = true;
    this.billDetailsData = [];
    const tempStock =  this.stockList.filter(x => x.agent_id === this.singleAgent.id);
    // this.billDetailsData = tempStock.filter(x => x.in_stock === 1);
    const tempData = tempStock.filter(x => x.in_stock === 1);
    if (tempData.length === 0){
      this._snackBar.open('No stock allocated to this agent', '', {
        duration: 2000,
      });
      this.showCheckbox = false;
    }else{
      this.billDetailsData = tempData;
    }
  }

  setAgent(data){
    this.singleAgent = data;
    // this.singleAgent = data;
  }

  testSetAgent(data){
    console.log(data);
  }

  deallocateAgent(item){
    const index = this.stockDeallocation.findIndex(x => x.id === item.id);
    if (index === -1){
      this.stockDeallocation.push(item);
      if (this.stockDeallocation.length === this.billDetailsData.length){
        this.isChecked = true;
      }
    }else{
    this.stockDeallocation.splice(index,1);
    if (this.stockDeallocation.length === 0){
      this.isChecked = false;
    }
    }
  }

  deallocateAgents(){
    this.stockService.updateStockByDefaultAgent(this.stockDeallocation)
      .subscribe((response: {success: number, data: Stock[]}) => {
        if (response.data){
          this.stockService.getUpdatedStockList();
          this.isChecked = false;
          // tslint:disable-next-line:prefer-for-of
          for ( let i = 0; i < this.stockDeallocation.length; i++){
            const index = this.billDetailsData.findIndex(x => x.id === this.stockDeallocation[i].id);
            this.billDetailsData.splice(index,1);
            // console.log(this.billDetailsData.length);
            if (this.billDetailsData.length === 0){
              this.showCheckbox = false;
            }
          }
        }
      });
  }

  selectAll(){
    if (this.isChecked === false) {

      this.stockDeallocation = [...this.billDetailsData];
      this.isChecked = true;
    }else{
      this.stockDeallocation = [];
      this.isChecked = false;
    }
  }

  // isCheckedFunction(item){
  //   console.log(item);
  // }

  stockSelection(data){
    this.tempStorageBillDetailsData.push(data);
    this.stockDeallocation = [];
    // @ts-ignore
    if (this.showCheckbox === true){
      this.billDetailsData = [];
      // console.log(this.showCheckbox);
      // if (this.tempStorageBillDetailsData.length !== 0){
      this.billDetailsData = [...this.tempStorageBillDetailsData];
      // }
    }else{
      this.billDetailsData.push(data);
    }
    this.showCheckbox = false;
    // @ts-ignore
    // this.billDetailsData.push(data);
    const index = this.stockList.findIndex(x => x.id === data.id);
    // this.stockList[index].isSet = true;
    this.stockList[index].isAgentSet = true;
  }

  removeFromStockBillEntry(data){
    const index = this.billDetailsData.findIndex(x => x.id === data.id );
    const stockIndex = this.stockList.findIndex(x => x.id === data.id );
    // this.stockList[stockIndex].isSet = false;
    this.stockList[stockIndex].isAgentSet = false;
    // @ts-ignore
    // if (this.billDetailsData[index].agent_id !== 2){
      // this.stockService.updateStockByDefaultAgent(this.billDetailsData, this.singleAgent)
      //   .subscribe((response: {success: number, data: Stock[]}) => {
      //   if (response.data){
      //     this.billDetailsData.splice(index, 1);
      //     this.stockService.getUpdatedStockList();
      //   }
      // });
    // }else{
    this.billDetailsData.splice(index, 1);
    this.tempStorageBillDetailsData = [...this.billDetailsData];
    // }
  }

}

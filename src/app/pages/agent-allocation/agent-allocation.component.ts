import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {AgentService} from '../../services/agent.service';
import {Stock} from '../../models/stock.model';
import {Agent} from '../../models/agent.model';
import Swal from 'sweetalert2';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-agent-allocation',
  templateUrl: './agent-allocation.component.html',
  styleUrls: ['./agent-allocation.component.scss']
})
export class AgentAllocationComponent implements OnInit {

  public searchTerm: string;
  stockList: Stock[];
  billDetailsData: Stock[] = [];
  agentData: Agent[];
  agentID: number;
  page: number;
  pageSize: number;
  p = 1;
  showCheckbox = false;
  stockDeallocation: Stock[] = [];
  isChecked = false;

  constructor(private stockService: StockService, private agentService: AgentService) {
    this.stockList = this.stockService.getStockList();
    this.page = 1;
    this.pageSize = 10;
    // this.agentData = this.agentService.getAgentList();
  }

  ngOnInit(): void {
    this.showCheckbox = false;
    this.isChecked = false;
    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      this.stockList.forEach(function(value){
        if (value.agent_id === 2) {
          value.isSet = false;
        }else{
          value.isSet = true;
        }
      });
      // tslint:disable-next-line:only-arrow-functions
      this.stockList.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
    });

    this.agentService.getAgentUpdateListener().subscribe((response) => {
      this.agentData = response;
      // console.log(this.agentID);
    });
    this.agentData = this.agentService.getAgentList();

  }

  updateStockAgent(){
    this.stockService.updateStockByAgent(this.billDetailsData, this.agentID)
      .subscribe((response: {success: number, data: Stock[]}) => {
        if (response.data){
          Swal.fire({
            title: 'Allocated',
            text: 'Stock allocated to agent',
            icon: 'success',
          });
          this.billDetailsData = [];
          // this.agentService.getLatestAgent();
          this.stockService.getUpdatedStockList();
        }
    });
  }

  searchStocks(){
    this.showCheckbox = true;
    // this.billDetailsData =  this.stockList.filter(x => x.agent_id === this.agentID);
    const tempStock =  this.stockList.filter(x => x.agent_id === this.agentID);
    this.billDetailsData = tempStock.filter(x => x.in_stock === 1);
  }

  setAgent(data){
    this.agentID = data;
  }

  deallocateAgent(item){
    const index = this.stockDeallocation.findIndex(x => x.id === item.id);
    if (index === -1){
      this.stockDeallocation.push(item);
    }else{
      this.stockDeallocation.splice(index,1);
    }
  }

  deallocateAgents(){
    this.stockService.updateStockByDefaultAgent(this.stockDeallocation)
      .subscribe((response: {success: number, data: Stock[]}) => {
        if (response.data){
          // this.billDetailsData.splice(index, 1);
          this.stockService.getUpdatedStockList();
          this.isChecked = false;
          for ( let i = 0; i < this.stockDeallocation.length; i++){
            const index = this.billDetailsData.findIndex(x => x.id === this.stockDeallocation[i].id);
            this.billDetailsData.splice(index,1);
          }
          // this.billDetailsData =  this.stockList.filter(x => x.agent_id === this.agentID);
          // delay(1000);
          // this.searchStocks();
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
    this.stockDeallocation = [];
    // @ts-ignore
    if (this.showCheckbox === true){
      this.billDetailsData = [];
    }
    this.showCheckbox = false;
    // @ts-ignore
    this.billDetailsData.push(data);
    const index = this.stockList.findIndex(x => x.id === data.id);
    this.stockList[index].isSet = true;
  }

  removeFromStockBillEntry(data){
    const index = this.billDetailsData.findIndex(x => x.id === data.id );
    const stockIndex = this.stockList.findIndex(x => x.id === data.id );
    this.stockList[stockIndex].isSet = false;
    // @ts-ignore
    // if (this.billDetailsData[index].agent_id !== 2){
      // this.stockService.updateStockByDefaultAgent(this.billDetailsData, this.agentID)
      //   .subscribe((response: {success: number, data: Stock[]}) => {
      //   if (response.data){
      //     this.billDetailsData.splice(index, 1);
      //     this.stockService.getUpdatedStockList();
      //   }
      // });
    // }else{
    this.billDetailsData.splice(index, 1);
    // }
  }

}

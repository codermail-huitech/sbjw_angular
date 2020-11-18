import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {AgentService} from '../../services/agent.service';
import {Stock} from '../../models/stock.model';

@Component({
  selector: 'app-agent-allocation',
  templateUrl: './agent-allocation.component.html',
  styleUrls: ['./agent-allocation.component.scss']
})
export class AgentAllocationComponent implements OnInit {

  stockList: Stock[];
  billDetailsData: Stock[];

  constructor(private stockService: StockService, agentService: AgentService) {
    this.stockList = this.stockService.getStockList();
  }

  ngOnInit(): void {
    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockList = response;
      // console.log(this.stockList);
      // tslint:disable-next-line:only-arrow-functions
      this.stockList.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
    });
  }

  stockSelection(data){
    this.billDetailsData.push(data);
    console.log(this.billDetailsData);
  }
  removeFromStockBillEntry(data){
    const index = this.billDetailsData.findIndex(x => x.id === data.id );
    this.billDetailsData.splice(index, 1);
    console.log(data);
  }

}

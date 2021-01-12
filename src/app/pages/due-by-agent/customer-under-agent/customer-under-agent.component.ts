import { Component, OnInit } from '@angular/core';
import {AgentService} from '../../../services/agent.service';
import {Customer} from '../../../models/customer.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-customer-under-agent',
  templateUrl: './customer-under-agent.component.html',
  styleUrls: ['./customer-under-agent.component.scss']
})
export class CustomerUnderAgentComponent implements OnInit {

  customerList: Customer[];
  agentId: number;
  CustomerPassbookList: any;
  isPassbookShown = false;
  customerName: string;

  printDivStyle = {
    printBillDiv: {marginRight : '3px', marginLeft : '3px', marginTop : '5px', backgroundColor: 'white'},
    table: {'border-collapse': 'collapse', width : '100%', backgroundColor: 'white'},
    label: {width: '100%'},
    th: {border: '1px  solid black'}
  };

  constructor(private  agentService: AgentService, private  route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isPassbookShown = false;
    this.route.params.subscribe((params) => {
      this.agentId = params.id;
      this.agentService.getCustomerUnderAgent(this.agentId).subscribe((response) => {
        this.customerList = response.data;
      });

    });
  }
  viewPassbook(data1, data2){
    this.customerName = data2;
    this.agentService.getCustomerPassbook(data1).subscribe((response) => {
      this.CustomerPassbookList = response.data;
      this.isPassbookShown = true;
    });
  }
  backToPrevious(){
    this.isPassbookShown = false;
  }

}

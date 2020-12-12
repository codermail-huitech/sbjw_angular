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

  printDivStyle = {
    printBillDiv: {marginRight : '3px', marginLeft : '3px', marginTop : '5px'},
    table: {'border-collapse': 'collapse', width : '100%'},
    label: {width: '100%'},
    th: {border: '1px  solid black'}
  };

  constructor(private  agentService: AgentService, private  route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.agentId = params.id;
      this.agentService.getCustomerUnderAgent(this.agentId).subscribe((response)=>{
        this.customerList = response.data;
      });

    });
  }

}

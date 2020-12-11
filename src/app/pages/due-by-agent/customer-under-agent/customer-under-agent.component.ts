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

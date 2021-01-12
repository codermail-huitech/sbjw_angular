import { Component, OnInit } from '@angular/core';
import {AgentService} from '../../services/agent.service';
import {Agent} from '../../models/agent.model';

@Component({
  selector: 'app-due-by-agent',
  templateUrl: './due-by-agent.component.html',
  styleUrls: ['./due-by-agent.component.scss']
})
export class DueByAgentComponent implements OnInit {

  agentList: Agent[];
  dueByAgentList: any;
  public searchTerm: string;

  page: number;
  pageSize: number;
  p = 1;

  printDivStyle = {
    printBillDiv: {marginRight : '3px', marginLeft : '3px', marginTop : '5px'},
    table: {'border-collapse': 'collapse', width : '100%'},
    label: {width: '100%'},
    th: {border: '1px  solid black'}
  };

  constructor(private  agentService: AgentService ) {
    this.agentList = this.agentService.getAgentList();
    this.dueByAgentList = this.agentService.getDueByAgentListList();
    // this.agentService.getDueByAgentDataUpdateListener().subscribe((response) => {
    //   this.dueByAgentList = response;
    // });
    this.page = 1;
    this.pageSize = 5;
  }

  ngOnInit(): void {
    this.agentService.getAgentUpdateListener().subscribe((response) => {
      this.agentList = response;
    });
    this.agentService.getDueByAgentDataUpdateListener().subscribe((response) => {
      this.dueByAgentList = response;
    });
  }
}

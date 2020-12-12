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


  constructor(private  agentService: AgentService ) {
    this.agentList = this.agentService.getAgentList();
    this.dueByAgentList = this.agentService.getDueByAgentList();
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

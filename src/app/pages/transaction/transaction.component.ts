import { Component, OnInit } from '@angular/core';
import {TransactionService} from '../../services/transaction.service';
import {FormGroup} from '@angular/forms';
import {TransactionType} from '../../models/transactionType.model';
import {AgentService} from '../../services/agent.service';
import {Agent} from '../../models/agent.model';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  transactionTypeData: TransactionType[];
  agentList: Agent[];
  agentValue = true;

  constructor(private transactionService: TransactionService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.agentValue = true;
    this.transactionForm = this.transactionService.transactionForm;

    this.transactionService.getTransactionTypeUpdateListener().subscribe((response) => {
      this.transactionTypeData = response;
    });
    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });
  }
  enableAgent(){
    if (this.transactionForm.value.transaction_id === 3){
      this.agentValue = false;
    }else {
      this.agentValue = true;
    }
  }
  saveTransaction(){
    console.log(this.transactionForm.value);
  }

}

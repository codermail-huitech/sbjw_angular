import { Component, OnInit } from '@angular/core';
import {TransactionService} from '../../services/transaction.service';
import {FormGroup} from '@angular/forms';
import {TransactionType} from '../../models/transactionType.model';
import {AgentService} from '../../services/agent.service';
import {Agent} from '../../models/agent.model';
import {TransactionInfo} from '../../models/transactionInfo.model';
import {OrderService} from '../../services/order.service';
import {DatePipe} from '@angular/common';
import Swal from 'sweetalert2';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  transactionTypeData: TransactionType[];
  agentList: Agent[];
  employeeList: Agent[];
  agentValue = true;

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  private user = JSON.parse(localStorage.getItem('user'));

  constructor(private transactionService: TransactionService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.agentValue = true;
    this.transactionForm = this.transactionService.transactionForm;

    this.transactionService.getTransactionTypeUpdateListener().subscribe((response) => {
      this.transactionTypeData = response;
      // console.log(this.user);
      if (this.user.personTypeId === 2){
        this.transactionTypeData = this.transactionTypeData.filter(x => x.id === 3 || x.id === 4);
        console.log(this.transactionTypeData);
      }
    });
    this.transactionService.getEmployeeDataUpdateListener().subscribe((response) => {
      this.employeeList = response;
    });
    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });
  }

  enableAgent(){
    if ((this.transactionForm.value.transaction_id === 3) || (this.transactionForm.value.transaction_id === 4)){
      this.agentValue = false;
    }else {
      this.agentValue = true;
    }
  }

  saveTransaction(){
    this.transactionForm.patchValue({person_id: this.user.id});
    this.transactionForm.value.received_date = this.pipe.transform(this.transactionForm.value.received_date, 'yyyy-MM-dd');
    this.transactionService.saveTransaction().subscribe((response: {success: number, data: TransactionInfo}) => {
      if (response.data)
      {
        Swal.fire(
          'Done!',
          'Received Gold Submitted',
          'success'
        );
        this.transactionForm.reset();
      }
    });
  }

}

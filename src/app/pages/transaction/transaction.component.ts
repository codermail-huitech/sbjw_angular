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
import {MaterialTransactionMaster} from '../../models/materialTransactionMaster.model';
import {MaterialTransactionDetail} from '../../models/materialTransactionDetail.model';
import {Material} from '../../models/material.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  transactionTypeData: TransactionType[];
  employeeList: User[];
  materialList: Material[];
  employee_value = false;
  materialTransactionMaster: MaterialTransactionMaster;
  materialTransactionDetails: MaterialTransactionDetail[] = [];

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  private user = JSON.parse(localStorage.getItem('user'));

  constructor(private transactionService: TransactionService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.employee_value = false;
    this.transactionForm = this.transactionService.transactionForm;

    this.transactionService.getTransactionTypeUpdateListener().subscribe((response) => {
      this.transactionTypeData = response;
      // console.log(this.user);
      if (this.user.personTypeId === 2){
        this.transactionTypeData = this.transactionTypeData.filter(x => x.id === 3 || x.id === 4);
      }else if (this.user.personTypeId === 3 || this.user.personTypeId === 4 || this.user.personTypeId === 5 || this.user.personTypeId === 6){
        this.transactionTypeData = this.transactionTypeData.filter(x => x.id === 3);
      }
    });
    this.transactionService.getEmployeeDataUpdateListener().subscribe((response) => {
      this.employeeList = response;
    });
    this.transactionService.getMaterialDataUpdateListener().subscribe((response) => {
      this.materialList = response;
    });
  }

  enableAgent(){
    if ((this.transactionForm.value.transaction_id === 1) || (this.transactionForm.value.transaction_id === 2)){
      // this.transactionForm.setValue({employee_id: null});
      this.employee_value = true;
      this.transactionForm.setValue({employee_id: null});
    }else {
      this.employee_value = false;
    }
  }

  saveTransaction(){
    this.transactionForm.value.received_date = this.pipe.transform(this.transactionForm.value.received_date, 'yyyy-MM-dd');
    this.materialTransactionMaster = {
      id : null,
      transaction_type_id : this.transactionForm.value.transaction_id,
      transaction_date : this.transactionForm.value.received_date,
      transaction_comment : this.transactionForm.value.transaction_comment,
      material_id : this.transactionForm.value.material_id,
    };

    if (this.transactionForm.value.transaction_id === 3){
      this.materialTransactionDetails = [
          {
            id: null,
            employee_id : this.user.id,
            quantity : this.transactionForm.value.quantity,
            transaction_value : -1,
          },
          {
            id: null,
            employee_id :  this.transactionForm.value.employee_id,
            quantity : this.transactionForm.value.quantity,
            transaction_value : 1,
          }
        ];
    } else if (this.transactionForm.value.transaction_id === 4){
      this.materialTransactionDetails = [
        {
          id: null,
          employee_id : this.user.id,
          quantity : this.transactionForm.value.quantity,
          transaction_value : 1,
        },
        {
          id: null,
          employee_id :  this.transactionForm.value.employee_id,
          quantity : this.transactionForm.value.quantity,
          transaction_value : -1,
        }
      ];
    } else if (this.transactionForm.value.transaction_id === 2){
      this.materialTransactionDetails = [
        {
          id: null,
          employee_id :  this.user.id,
          quantity : this.transactionForm.value.quantity,
          transaction_value : -1,
        }
      ];
    }else{
      this.materialTransactionDetails = [
        {
          id: null,
          employee_id :  this.user.id,
          quantity : this.transactionForm.value.quantity,
          transaction_value : 1,
        }
      ];
    }
    this.transactionService.saveTransaction(this.materialTransactionMaster, this.materialTransactionDetails).subscribe((response: { success: number , data: MaterialTransactionMaster}) => {
      if (response.data){
        Swal.fire({
          title: 'Saved',
          text: 'Transaction  has been saved',
          icon: 'success',
        });
        this.transactionForm.reset();
      }
    });



    // console.log(this.materialTransactionMaster);
    // console.log(this.materialTransactionDetails);

    // return;
    // this.transactionForm.patchValue({person_id: this.user.id});
    // this.transactionForm.value.received_date = this.pipe.transform(this.transactionForm.value.received_date, 'yyyy-MM-dd');
    // this.transactionService.saveTransaction().subscribe((response: {success: number, data: TransactionInfo}) => {
    //   if (response.data)
    //   {
    //     Swal.fire(
    //       'Done!',
    //       'Received Gold Submitted',
    //       'success'
    //     );
    //     this.transactionForm.reset();
    //   }
    // });
  }

}

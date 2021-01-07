import { Component, OnInit } from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {CustomerService} from '../../services/customer.service';
import {OrderService} from '../../services/order.service';
import {Customer} from '../../models/customer.model';
import {Agent} from '../../models/agent.model';
import {FormGroup} from '@angular/forms';
import Swal from "sweetalert2";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-gold-payment',
  templateUrl: './gold-payment.component.html',
  styleUrls: ['./gold-payment.component.scss']
})
export class GoldPaymentComponent implements OnInit {

  goldPaymentForm: FormGroup;
  customerList: Customer[];
  agentList: Agent[];

  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  constructor(private paymentService: PaymentService, private customerService: CustomerService, private orderService: OrderService) {
    this.agentList = this.orderService.getAgentList();
    this.customerList = this.customerService.getCustomers();
  }

  ngOnInit(): void {
    this.goldPaymentForm = this.paymentService.goldPaymentForm;
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerList = customers;
      });
    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });
  }

  savePayment(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Please confirm the payment',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm ?',
      cancelButtonText: 'Decline'
    }).then((result) => {
      if (result.value) {
        this.goldPaymentForm.value.received_date = this.pipe.transform(this.goldPaymentForm.value.received_date, 'yyyy-MM-dd') ;
        const user = JSON.parse(localStorage.getItem('user'));
        // this.cashPaymentForm.patchValue({user_id: user.id});
        this.goldPaymentForm.value.user_id = user.id;
          this.paymentService.saveGoldPayment().subscribe((response) => {
          if (response.data){
            Swal.fire(
              'Done!',
              'Payment Accepted',
              'success'
            );
            this.goldPaymentForm.reset();
            this.goldPaymentForm.patchValue({user_id: 0});
          }
        });
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Payment Declined',
          'error'
        );
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {JobService} from '../../services/job.service';
import {Karigarh} from '../../models/karigarh.model';
import {Product} from '../../models/product.model';
import {OrderService} from '../../services/order.service';
import {OrderMaster} from '../../models/orderMaster.model';
import {OrderDetail} from '../../models/orderDetail.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  jobMasterForm: FormGroup;
  karigarhData: Karigarh[] = [];
  orderMasterData: OrderMaster[];
  orderDetails: OrderDetail[];
  showProduct = true;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');

  constructor(private jobService: JobService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.jobMasterForm = this.jobService.jobMasterForm;
    this.jobService.getKarigarhUpdateListener().subscribe((responseProducts: Karigarh[]) => {
      this.karigarhData = responseProducts;
    });
    this.orderService.getOrderUpdateListener().subscribe((responseProducts: OrderMaster[]) => {
      this.orderMasterData = responseProducts;
    });
  }
  viewDetails(data){
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.showProduct = false;
        this.orderDetails = orderDetails;
      });
  }
  productShow(){
    this.showProduct = !this.showProduct;
  }
  placeJob(details){
    console.log(details);
    this.jobMasterForm.patchValue({model_number: details.model_number, order_details_id: details.id});
  }
  onSubmit(){
    this.jobMasterForm.value.date = this.pipe.transform(this.jobMasterForm.value.date, 'yyyy-MM-dd');
    console.log(this.jobMasterForm.value);
  }
}

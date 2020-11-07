import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';
import {OrderDetail} from '../../../models/orderDetail.model';

@Component({
  selector: 'app-bill-order-details',
  templateUrl: './bill-order-details.component.html',
  styleUrls: ['./bill-order-details.component.scss']
})
export class BillOrderDetailsComponent implements OnInit {
  orderDetails: OrderDetail[];
  disableDetails: boolean;

  constructor(private  route: ActivatedRoute, private billService: BillService) { }

  ngOnInit(): void {
    this.disableDetails = false;
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.billService.getDetails(params['id']);
    });
    this.billService.getOrderDetailsSubUpdateListener()
      .subscribe((details: OrderDetail[]) => {
        this.orderDetails = details;
      });
  }
  disablePage(){
    this.disableDetails = true;
  }

}

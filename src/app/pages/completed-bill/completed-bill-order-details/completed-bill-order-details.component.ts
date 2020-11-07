import { Component, OnInit } from '@angular/core';
import {OrderDetail} from '../../../models/orderDetail.model';
import {ActivatedRoute} from '@angular/router';
import {BillService} from '../../../services/bill.service';

@Component({
  selector: 'app-completed-bill-order-details',
  templateUrl: './completed-bill-order-details.component.html',
  styleUrls: ['./completed-bill-order-details.component.scss']
})
export class CompletedBillOrderDetailsComponent implements OnInit {
  orderDetails: OrderDetail[];
  disableDetails: boolean;
  constructor(private  route: ActivatedRoute, private billService: BillService) { }

  ngOnInit(): void {
    this.disableDetails = false;
    this.route.params.subscribe(params => {
      this.billService.getCompletedBIllDetails(params.id);
    });
    this.billService.getCompletedBillOrderDetailsSubUpdateListener()
      .subscribe((details: OrderDetail[]) => {
        this.orderDetails = details;
      });
  }
  disablePage(){
    this.disableDetails = true;
  }

}

import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderForm: FormGroup;


  constructor() {
    this.orderForm = new FormGroup({
      id : new FormControl(null),
      customer_id : new FormControl(null, [Validators.required])
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {FormGroup} from '@angular/forms';
import {Stock} from '../../models/stock.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stockForm: FormGroup;
  stockData: Stock[] = [];
  stockList: Stock[] = [];

  dividor : number;
  remainder : number;
  totalAraay : number;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockForm = this.stockService.stockFrom;
    this.stockService.getStockUpdateListener().subscribe((response: Stock[]) => {
      // console.log(response);
      this.stockData = response;
    });
  }
  findStock(data){
    const index = this.stockData.findIndex(x => x.order_details_id === data);
    var x = this.stockData[index];
    this.stockForm.patchValue({order_details_id: x.order_details_id , job_master_id: x.job_master_id, order_name: x.order_name , quantity: x.quantity, approx_gold: x.approx_gold, amount: (x.quantity * x.price)});
  }

  calculateDivision(){
    // if (!((this.stockForm.value.quantity % this.stockForm.value.division) === 0)) {
    //   this.stockForm.controls['division'].reset();
    //   this.stockForm.controls['set_amount'].reset();
    //   this.stockForm.controls['set_gold'].reset();
    //   this.stockForm.controls['set_quantity'].reset();
    //   return false;
    // }
    // else{
    //   this.stockForm.patchValue({set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division), set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division).toFixed(3), set_amount: (this.stockForm.value.amount / this.stockForm.value.division).toFixed(3)});
    //   return true;
    // }
    if ((this.stockForm.value.quantity % this.stockForm.value.division) === 0) {
      this.stockForm.patchValue({set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division), set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division).toFixed(3), set_amount: (this.stockForm.value.amount / this.stockForm.value.division).toFixed(3)});
    }
    else{
      // tslint:disable-next-line:radix
      // console.log(this.stockForm.value.quantity);
      // console.log(this.stockForm.value.dividor);
      // tslint:disable-next-line:radix
      this.dividor =parseInt(String(this.stockForm.value.quantity / this.stockForm.value.division));
      // tslint:disable-next-line:radix
      this.remainder =parseInt(String(this.stockForm.value.quantity % this.stockForm.value.division));
      this.stockForm.patchValue({set_quantity: this.dividor, set_gold: ((this.stockForm.value.approx_gold / this.stockForm.value.quantity) * this.dividor).toFixed(3), set_amount: ((this.stockForm.value.amount / this.stockForm.value.quantity) * this.dividor).toFixed(3)});
      console.log("divider");
      console.log(this.dividor);
      console.log("remainder");
      console.log(this.remainder);
      console.log("form");
      console.log(this.stockForm.value);
    }
  }

  setStock(){
    // tslint:disable-next-line:radix
    // this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    // tslint:disable-next-line:radix
    this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    if (this.remainder > 0){
      // tslint:disable-next-line:prefer-const
      let temp = {
        id: null,
        order_details_id: this.stockForm.value.order_details_id,
        order_name: this.stockForm.value.order_name,
        job_master_id: this.stockForm.value.job_master_id,
        approx_gold: this.stockForm.value.approx_gold,
        quantity: this.stockForm.value.quantity,
        price: this.stockForm.value.price,
        amount: this.stockForm.value.amount,
        set_quantity: this.stockForm.value.quantity - (this.dividor * this.stockForm.value.division),
        set_gold: ((this.stockForm.value.approx_gold / this.stockForm.value.quantity) * (this.stockForm.value.quantity - (this.dividor * this.stockForm.value.division))).toFixed(3),
        set_amount: ((this.stockForm.value.amount / this.stockForm.value.quantity) * (this.stockForm.value.quantity - (this.dividor * this.stockForm.value.division))).toFixed(3)
      };
      // @ts-ignore
      this.stockList.push(temp);
    }
  }

  saveStock(){
    // console.log("save");
    // this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    // console.log(this.stockList);
    // this.stockService.saveStock(this.stockList).subscribe((response: {success: number, data: Stock})  => {
    //   console.log("component response");
    //   console.log(response);
    //   // this.products.unshift(response.data);
    //   //
    //   // this.productSubject.next([...this.products]);
    //   // console.log(this.products);
    // });
  }

}

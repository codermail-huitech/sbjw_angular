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

  // dividor : number;
  // remainder : number;
  // totalAraay : number;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockForm = this.stockService.stockFrom;
    this.stockService.getStockUpdateListener().subscribe((response: Stock[]) => {
      // console.log(response);
      this.stockData = response;
    });
  }
  findStock(data){
    const index = this.stockData.findIndex(x => x.id === data);
    var x = this.stockData[index];
    this.stockForm.patchValue({id: x.id , job_master_id: x.job_master_id, order_name: x.order_name , quantity: x.quantity, approx_gold: x.approx_gold, amount: (x.quantity * x.price)});
  }

  calculateDivision(){
    if (!((this.stockForm.value.quantity % this.stockForm.value.division) === 0)) {
      this.stockForm.controls['division'].reset();
      this.stockForm.controls['set_amount'].reset();
      this.stockForm.controls['set_gold'].reset();
      this.stockForm.controls['set_quantity'].reset();
      return false;
    }
    else{
      this.stockForm.patchValue({set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division), set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division).toFixed(3), set_amount: (this.stockForm.value.amount / this.stockForm.value.division).toFixed(3)});
      return true;
    }
  }

  setStock(){
    // tslint:disable-next-line:radix
    this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    console.log(this.stockList);
  }

  saveStock(){
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

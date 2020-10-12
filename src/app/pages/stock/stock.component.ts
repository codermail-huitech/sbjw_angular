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
    this.stockForm.patchValue({quantity:x.quantity, approx_gold:x.approx_gold, amount: (x.quantity * x.price)});
  }
  calculateDivision(){
    if (!((this.stockForm.value.quantity % this.stockForm.value.division) === 0)) {
      // this.stockForm.patchValue({set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division), set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division), set_amount: (this.stockForm.value.amount / this.stockForm.value.division)});
      this.stockForm.controls['division'].reset();
      return false;
    }
    else{
      this.stockForm.patchValue({set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division), set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division), set_amount: (this.stockForm.value.amount / this.stockForm.value.division)});
      // this.stockForm.controls['division'].reset();
      return true;
      // this.stockForm.controls['division'].reset();
    }
  }


  setStock(){
    // tslint:disable-next-line:radix
    this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    console.log(this.stockList);
  }

}

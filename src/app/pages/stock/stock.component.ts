import { Component, OnInit } from '@angular/core';
import {StockService} from '../../services/stock.service';
import {FormGroup} from '@angular/forms';
import {Stock} from '../../models/stock.model';
import Swal from 'sweetalert2';
import {Customer} from '../../models/customer.model';
import {ActivatedRoute} from '@angular/router';
import {JobMaster} from '../../models/jobMaster.model';
import {JobService} from '../../services/job.service';
import {parse} from '@fortawesome/fontawesome-svg-core';
import {isNumber} from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stockForm: FormGroup;
  stockData: Stock[];
  stockList: Stock[] = [];
  // tslint:disable-next-line:max-line-length
  // tempStock: { approx_gold: any; amount: any; quantity: any; set_quantity: number; set_gold: string; order_details_id: any; set_amount: string; price: any; id: null; job_master_id: any; order_name: any };
  // tempStock: {};
  tempStock: Stock;
  jobMasterData: Stock[];

  divider: number;
  remainder: number;
  totalAraay: number;
  // stockCustomerList: Customer[];
  filterResult: any;
  showStockList = false;



  constructor(private stockService: StockService, private router: ActivatedRoute ,  private  jobService: JobService) {
    this.stockData = this.stockService.getStockList();
  }

  ngOnInit(): void {

    this.stockForm = this.stockService.stockFrom;

    this.stockService.getStockUpdateListener().subscribe((response) => {
      this.stockData = response;
      // tslint:disable-next-line:only-arrow-functions
      this.stockData.forEach(function(value) {
        const x = value.tag.split('-');
        // tslint:disable-next-line:radix
        value.tag = (parseInt(x[1]).toString(16) + '-' + parseInt(x[2]).toString(16) + '-' + parseInt(x[3]));
      });
    });

    this.router.params.subscribe((params) => {
      if (params.id === undefined){
        this.showStockList = true;
      }
      else{
        this.stockService.getRecordByJobMasterId(params.id);

        this.stockService.getJobMasterDataUpdateListener().subscribe((response) => {
          this.jobMasterData = response;
          this.stockForm.patchValue({
            person_name: this.jobMasterData[0].person_name,
            job_number: this.jobMasterData[0].job_number,
            order_details_id: this.jobMasterData[0].order_details_id,
            job_master_id: this.jobMasterData[0].job_master_id,
            order_name: this.jobMasterData[0].order_name,
            approx_gold: this.jobMasterData[0].approx_gold,
            quantity: this.jobMasterData[0].quantity,
            price: this.jobMasterData[0].price,
            amount: this.jobMasterData[0].price * this.jobMasterData[0].quantity,
          });
        });
      }
    });

  }

  calculateDivision() {
    if (this.stockForm.value.quantity >= this.stockForm.value.division) {
      if ((this.stockForm.value.quantity % this.stockForm.value.division) === 0) {
        this.stockForm.patchValue({
          set_quantity: (this.stockForm.value.quantity / this.stockForm.value.division),
          set_gold: (this.stockForm.value.approx_gold / this.stockForm.value.division).toFixed(3),
          set_amount: (this.stockForm.value.amount / this.stockForm.value.division).toFixed(3)
        });
        // tslint:disable-next-line:radix
        this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
      } else {
        // tslint:disable-next-line:radix
        this.divider = parseInt(String(this.stockForm.value.quantity / this.stockForm.value.division));
        // tslint:disable-next-line:radix
        this.remainder = parseInt(String(this.stockForm.value.quantity % this.stockForm.value.division));
        this.stockForm.patchValue({
          set_quantity: this.divider,
          set_gold: parseFloat(String((this.stockForm.value.approx_gold / this.stockForm.value.quantity) * this.divider)).toFixed(3),
          set_amount: parseFloat(String((this.stockForm.value.amount / this.stockForm.value.quantity) * this.divider)).toFixed(3)
        });
        // tslint:disable-next-line:radix
        this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
        if (this.remainder > 0) {
          // tslint:disable-next-line:prefer-const
          let temp = {
            id: null,
            order_details_id: this.stockForm.value.order_details_id,
            order_name: this.stockForm.value.order_name,
            job_number: this.stockForm.value.job_number,
            job_master_id: this.stockForm.value.job_master_id,
            approx_gold: this.stockForm.value.approx_gold,
            quantity: this.stockForm.value.quantity,
            price: this.stockForm.value.price,
            amount: this.stockForm.value.amount,
            set_quantity: this.stockForm.value.quantity - (this.divider * this.stockForm.value.division),
            set_gold: parseFloat(String((this.stockForm.value.approx_gold / this.stockForm.value.quantity) * (this.stockForm.value.quantity - (this.divider * this.stockForm.value.division)))).toFixed(3),
            set_amount: parseFloat(String((this.stockForm.value.amount / this.stockForm.value.quantity) * (this.stockForm.value.quantity - (this.divider * this.stockForm.value.division)))).toFixed(3)
          };
          this.tempStock = temp;
          // @ts-ignore
          this.stockList.push(temp);
        }
      }
    } else {
      this.stockList = [];
      Swal.fire({
        title: 'Invalid Divison',
        text: 'Divison should be less than or equal to quantity',
        icon: 'warning',
      });
    }
  }

  saveStock(){
    // console.log("save");
    // tslint:disable-next-line:radix
    this.stockList = Array(parseInt(this.stockForm.value.division)).fill(this.stockForm.value);
    if (this.tempStock){
      this.stockList.push(this.tempStock);
    }
    // console.log(this.stockList);
    this.stockService.saveStock(this.stockList).subscribe((response: {success: number, data: Stock})  => {
        if (response.data) {
          Swal.fire(
            'Done!',
            'Submitted in Stock',
            'success'
          );
          // const index = this.filterResult.findIndex(x => x.id === this.stockForm.value.job_master_id);
          // this.filterResult.splice(index,1);
          // this.stockService.getUpdatedStockCustomer();
          // this.stockService.getUpdatedStockRecord();
          this.jobService.getUpdatedFinishedJob();
          this.stockForm.reset();
        }
    });

  }

}

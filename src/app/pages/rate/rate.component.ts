import { Component, OnInit } from '@angular/core';
import {RateService} from '../../services/rate.service';
import {FormGroup} from '@angular/forms';
import {Rate} from '../../models/rate.model';
import {PriceCodeService} from '../../services/price-code.service';
import {PriceCode} from '../../models/priceCode.model';
import {CustomerCategoryService} from '../../services/customer-category.service';
import {CustomerCategory} from '../../models/customerCategory.model';
import {Product} from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  rateForm: FormGroup;
  rateData: Rate[] = [];
  priceCodes: PriceCode[] = [];
  customerCategories: CustomerCategory[] = [];

  constructor(private rateService: RateService, private priceCodeService: PriceCodeService, private customerCategoryService: CustomerCategoryService) { }

  ngOnInit(): void {
    this.rateForm = this.rateService.rateForm;

    this.rateService.getRateUpdateListener().subscribe((response) => {
      this.rateData = response;
    });

    this.priceCodeService.getPriceCodeUpdateListener().subscribe((response) => {
      this.priceCodes = response;
    });

    this.customerCategoryService.getCustomerCategoryUpdateListener().subscribe((response) =>{
      this.customerCategories = response;
    });

    // this.rateData = this.rateService.gettingRateData();
    // console.log("rates component");
    // console.log(this.rateData);

  }

  onSubmit(){
    console.log(this.rateForm.value);
    this.rateService.saveRate().subscribe((response: {success: number, data: Rate}) => {
      if(response.data){
        Swal.fire(
          'Saved!',
          'Item Successfully saved',
          'success'
        );
        this.rateData.unshift(response.data);
      }
    });
  }

}

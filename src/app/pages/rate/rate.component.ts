import { Component, OnInit } from '@angular/core';
import {RateService} from '../../services/rate.service';
import {FormControl, FormGroup} from '@angular/forms';
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
  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private rateService: RateService, private priceCodeService: PriceCodeService, private customerCategoryService: CustomerCategoryService) {
    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.rateForm = this.rateService.rateForm;

    this.rateService.getRateUpdateListener().subscribe((response) => {
      this.rateData = response;
    });

    this.priceCodeService.getPriceCodeUpdateListener().subscribe((response) => {
      this.priceCodes = response;
    });

    this.customerCategoryService.getCustomerCategoryUpdateListener().subscribe((response) => {
      this.customerCategories = response;
    });

  }

  onSubmit(){
    this.rateService.saveRate().subscribe((response: {success: number, data: Rate}) => {
      if (response.data){
        Swal.fire(
          'Saved!',
          'Item Successfully saved',
          'success'
        );
        // console.log(response.data);
        this.rateData.unshift(response.data);
        this.rateForm.reset();
      }
    });
  }

  deleteRate(rateData){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Item will be deleted from rate list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.rateService.deleteRate(rateData.id).subscribe((response: {success: number, data: Rate} ) => {
          if (response.data){
            const index = this.rateData.findIndex(x => x.id === response.data.id);
            this.rateData.splice(index, 1);
            Swal.fire(
              'Deleted!',
              'Item deleted from Order List',
              'success'
            );
          }
        });
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Not Deleted :)',
          'error'
        );
      }
    });
  }

  editRate(rateData){
    this.rateForm.patchValue({id: rateData.id , price_code_id: rateData.price_code_id, customer_category_id: rateData.customer_category_id, price: rateData.price, p_loss: rateData.p_loss});
  }
  clearRate(){
    this.rateForm.reset();
  }

  updateRate(){
    this.rateService.updateRate().subscribe((response: {success: number, data: Rate}) => {
      if (response.data){
        const index = this.rateData.findIndex(x => x.id === response.data.id);
        this.rateData[index] = response.data;
        Swal.fire(
          'Updated!',
          'Item Successfully updated',
          'success'
        );
        this.rateForm.reset();
      }
    });
  }

}

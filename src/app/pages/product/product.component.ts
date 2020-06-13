import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormGroup} from '@angular/forms';
import {PriceCodeService} from '../../services/price-code.service';
import {PriceCode} from '../../models/priceCode.model';
import {ProductCategoryService} from '../../services/product-category.service';
import {ProductCategory} from '../../models/productCategory.model';
import {Observable} from 'rxjs';
import {UpdateSncakBarComponent} from '../customer/update-sncak-bar/update-sncak-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  priceCodes: PriceCode[] = [];
  productCategories: ProductCategory[] = [];
  productForm: FormGroup;


  // tslint:disable-next-line:max-line-length
  constructor(private productService: ProductService, private priceCodeService: PriceCodeService, private productCategoryService: ProductCategoryService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    this.productForm = this.productService.productForm;
    this.products = this.productService.getProducts();
    this.productService.getProductUpdateListener().subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });

    this.priceCodeService.getPriceCodeUpdateListener().subscribe((responsePriceCodes: PriceCode[]) => {
      this.priceCodes = responsePriceCodes;
    });

    this.productCategoryService.getProductCategoryUpdateListener().subscribe((responseProductCategory: ProductCategory[]) => {
      this.productCategories = responseProductCategory;
    });
  }

  clearProductForm(){
    this.productForm.reset();
  }

  populateFormByCurrentProduct(product: Product){
    console.log(product);
    this.productService.fillFormByUpdatebaleData(product);
  }

  onSubmit(){
    this.productService.saveProduct(this.productForm.value);
  }

  updateProduct(){
    let updateObserable: Observable<any>;
    updateObserable = this.productService.updateProduct(this.productForm.value);
    updateObserable.subscribe((response) => {
      if (response.success === 1){
        this.snackBar.openFromComponent(UpdateSncakBarComponent, {
          duration: 4000, data: {message: 'Product Updated!'}
        });
      }
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this.snackBar.openFromComponent(UpdateSncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }

}

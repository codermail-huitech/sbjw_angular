import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormGroup} from '@angular/forms';
import {PriceCodeService} from '../../services/price-code.service';
import {PriceCode} from '../../models/priceCode.model';
import {ProductCategoryService} from '../../services/product-category.service';
import {ProductCategory} from '../../models/productCategory.model';

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
  constructor(private productService: ProductService, private priceCodeService: PriceCodeService, private productCategoryService: ProductCategoryService) {
  }

  ngOnInit(): void {

    this.productForm = this.productService.productForm;
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

  onSubmit(){
    console.log(this.productForm.value);
    this.productService.saveProduct(this.productForm.value);
  }

}

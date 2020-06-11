import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {

    this.productForm = this.productService.productForm;

    this.productService.productSubject.subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });
  }

  onSubmit(){
    this.productService.saveProduct(this.productForm.value);
  }

}

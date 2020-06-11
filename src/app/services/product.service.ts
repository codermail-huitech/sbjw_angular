import { Injectable } from '@angular/core';
import {Product} from '../models/product.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface ProductResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  products: Product[] = [];
  productForm: FormGroup;
  productSubject = new Subject<Product[]>();

  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/products')
      .subscribe((response: {success: number, data: Product[]}) => {
        // console.log(response);
        // @ts-ignore
        const {data} = response;
        // const data=response.data;
        this.products = data;
        this.productSubject.next([...this.products]);
      });

    this.productForm = new FormGroup({
      id : new FormControl(null),
      product_name : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      model_number : new FormControl(null, [Validators.required]),
    });
  }

  saveProduct(product){
    console.log(product);
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/products', product)
      .subscribe((response: {success: number, data: Product})  => {
        // this.products.unshift(response.data);
        // this.productSubject.next([...this.products]);
      });
  }

}

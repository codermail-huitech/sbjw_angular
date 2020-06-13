import { Injectable } from '@angular/core';
import {Product} from '../models/product.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PriceCode} from '../models/priceCode.model';
import {catchError, tap} from 'rxjs/operators';
import {Customer} from '../models/customer.model';
import {CustomerResponseData} from './customer.service';

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
        const {data} = response;
        this.products = data;
        this.productSubject.next([...this.products]);
      });

    this.productForm = new FormGroup({
      id : new FormControl(null),
      product_name : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      model_number : new FormControl(null, [Validators.required]),
      price_code_id : new FormControl(null, [Validators.required]),
      product_category_id : new FormControl(null, [Validators.required]),
    });
  }
  getProducts(){
    // when no data it will return null;
    return [...this.products];
  }

  fillFormByUpdatebaleData(product){
    this.productForm.setValue(product);
  }

  getProductUpdateListener(){
    return this.productSubject.asObservable();
  }

  saveProduct(product){
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/products', product)
      .subscribe((response: {success: number, data: Product})  => {
        this.products.unshift(response.data);
        this.productSubject.next([...this.products]);
      });
  }

  updateProduct(product){

    return this.http.patch<ProductResponseData>('http://127.0.0.1:8000/api/products' , product)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: Product}) => {
        const index = this.products.findIndex(x => x.id === product.id);
        this.products[index] = response.data;
        console.log(response);
        this.productSubject.next([...this.products]);
      }));
  }

  private _serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }

}

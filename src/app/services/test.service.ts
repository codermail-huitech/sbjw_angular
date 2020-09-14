import { Injectable } from '@angular/core';
import {Customer} from '../models/customer.model';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class TestService {
  constructor(private http: HttpClient) {
    console.log('Test service controller');
    console.log('customer service constructor called in Test Service');
    // this.http.get('http://127.0.0.1:8000/api/customers')
    //   .subscribe((response: {success: number, data: Customer[]}) => {
    //     // console.log(response);
    //     // @ts-ignore
    //     const {data} = response;
    //     this.customerData = data;
    //   });
  }
}

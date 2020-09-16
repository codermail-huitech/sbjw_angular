import { Injectable } from '@angular/core';
import {CustomerCategory} from '../models/customerCategory.model';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Rate} from '../models/rate.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerCategoryService {
customerCategoryData: CustomerCategory[] = [];

private customerCategorySub = new Subject<CustomerCategory[]>();

  getCustomerCategoryUpdateListener(){
    return this.customerCategorySub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/getCustomerCategory')
      .subscribe((response: {success: number, data: CustomerCategory[]}) => {
        // console.log(response);
        const {data} = response;
        // console.log(data);
        this.customerCategoryData = data;
        this.customerCategorySub.next([...this.customerCategoryData]);
      });
  }
}

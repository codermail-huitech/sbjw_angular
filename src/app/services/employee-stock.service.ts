import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Karigarh} from '../models/karigarh.model';
import {Subject} from 'rxjs';
import {JobMaster} from '../models/jobMaster.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStockService {

  employeeStockData: any = [] ;
  private employeeStockDataSub = new Subject<any>();


  getEmployeeStockDataUpdateListener(){
    return this.employeeStockDataSub.asObservable();
  }

  constructor(private http: HttpClient) {

    // fetching employee stocks
    // this.http.get(GlobalVariable.BASE_API_URL + '/testGetEmployeeMaterial')
    //   .subscribe((response: {success: number, data: any}) => {
    //     const {data} = response;
    //     this.employeeStockData = data;
    //     this.employeeStockDataSub.next([...this.employeeStockData]);
    //   });

    this.http.get(GlobalVariable.BASE_API_URL + '/myTest')
      .subscribe((response: {success: number, data: any}) => {
        const {data} = response;
        this.employeeStockData = data;
        this.employeeStockDataSub.next([...this.employeeStockData]);
      });



     }

     getEmployeeStock(){

        return [...this.employeeStockData];
     }
  }

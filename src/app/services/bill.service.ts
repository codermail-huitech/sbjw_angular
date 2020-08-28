import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FinishedJobs} from "../models/finishedJobs";
import {GlobalVariable} from "../shared/global";
import {Karigarh} from "../models/karigarh.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  finshedJobs : FinishedJobs[] = [];
  private finishedJobsSub = new Subject<FinishedJobs[]>();

  getFinishedJobsSubUpdateListener(){
    return this.finishedJobsSub.asObservable();
  }

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobsCustomers')
      .subscribe((response: {success: number, data: FinishedJobs[]}) => {
        const {data} = response;
        this.finshedJobs = data;
        this.finishedJobsSub.next([...this.finshedJobs]);
      });


  }
}

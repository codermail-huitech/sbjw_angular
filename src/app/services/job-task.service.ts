import { Injectable } from '@angular/core';
import {GlobalVariable} from '../shared/global';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderDetail} from '../models/OrderDetail.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobTaskService {

  jobTaskForm: FormGroup;

  savedJobsList : OrderDetail[];
  private savedJobsSub = new Subject<OrderDetail[]>();

  getSavedJobsUpdateListener(){
    return this.savedJobsSub.asObservable();
  }


  constructor(private http: HttpClient) {

    this.jobTaskForm = new FormGroup({
      id : new FormControl(null),
      approx_gold : new FormControl(null, [Validators.required]),
      p_loss : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      Price : new FormControl(null, [Validators.required]),
      quantity : new FormControl({value: null, disabled: true}, [Validators.required])

    });

    //fetching the orders which are sent to job

    this.http.get(GlobalVariable.BASE_API_URL + '/savedJobs')
      .subscribe((response: {success: number, data: OrderDetail[]}) => {
        const {data} = response;
        this.savedJobsList = data;
        console.log(this.savedJobsList);
        this.savedJobsSub.next([...this.savedJobsList]);
      });
  }
}

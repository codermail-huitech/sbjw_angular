import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Karigarh} from '../models/karigarh.model';
import {GlobalVariable} from '../shared/global';
import {Agent} from '../models/agent.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {OrderMaster} from '../models/orderMaster.model';
import {catchError, tap} from 'rxjs/operators';
import {OrderResponseData} from './order.service';
import {JobMaster} from '../models/jobMaster.model';
import {FinishedJobs} from "../models/finishedJobs";
import {formatDate} from '@angular/common';

export interface JobResponseData {
  success: number;
  data: object;
}


@Injectable({
  providedIn: 'root'
})
export class JobService {
  // variable declaration
  jobMasterForm: FormGroup;
  jobDetailsForm: FormGroup;
  karigarhData: Karigarh[] = [];
  orderMaster: OrderMaster[];

  savedJobsList: JobMaster[] = [];
  finishedJobsList: JobMaster[] = [];
  // jobMasterData: JobMaster;

  // subject declaration
  private karigarhSub = new Subject<Karigarh[]>();

  private finishedJobsSub = new Subject<JobMaster[]>();
  private savedJobsSub = new Subject<JobMaster[]>();

  getKarigarhUpdateListener(){
    return this.karigarhSub.asObservable();
  }
  getSavedJobsUpdateListener(){
    return this.savedJobsSub.asObservable();
  }
  getFinishedJobsUpdateListener(){
    return this.finishedJobsSub.asObservable();
  }

  constructor(private http: HttpClient) {

    const job_date = new Date();
    const job_date_format = formatDate(job_date , 'dd/MM/yyyy', 'en');
    this.jobMasterForm = new FormGroup({
      id : new FormControl(null),
      date : new FormControl({value: job_date_format, disabled: true}, [Validators.required]),
      karigarh_id : new FormControl(null, [Validators.required]),
      gross_weight : new FormControl(null, [Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      model_number : new FormControl({value: null, disabled: true}, [Validators.required]),
      material_name : new FormControl({value: null, disabled: true}, [Validators.required])
    });
    this.jobDetailsForm = new FormGroup({
      id : new FormControl(null),
      employee_id : new FormControl(null, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      material_quantity : new FormControl(null, [Validators.required])
    });

    //fetching karigarhs
    this.http.get(GlobalVariable.BASE_API_URL + '/karigarhs')
      .subscribe((response: {success: number, data: Karigarh[]}) => {
        const {data} = response;
        this.karigarhData = data;
        this.karigarhSub.next([...this.karigarhData]);
      });

    //-----------------
    this.http.get(GlobalVariable.BASE_API_URL + '/savedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.savedJobsList = data;
        this.savedJobsSub.next([...this.savedJobsList]);
      });

    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.finishedJobsList = data;
        this.finishedJobsSub.next([...this.finishedJobsList]);
      });

  }

  getAllKarigarhs(){
    return [...this.karigarhData];
  }


  getAllJobList(){

    return [...this.savedJobsList];
  }

  getFinishedJobList(){

    return [...this.finishedJobsList];
  }

  getUpdatedFinishedJob(){
    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.finishedJobsList = data;
        this.finishedJobsSub.next([...this.finishedJobsList]);
      });
  }


  saveJob(){
    // tslint:disable-next-line:max-line-length
    this.jobMasterForm.value.date = formatDate(this.jobMasterForm.value.date , 'yyyy-MM-dd', 'en');
    return this.http.post<JobResponseData>( GlobalVariable.BASE_API_URL + '/jobs', {master: this.jobMasterForm.value, details: this.jobDetailsForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobMaster}) => {
        if (response.data){
             this.savedJobsList.unshift(response.data);
             // this.savedJobsSub.next([...this.savedJobsList]);
        }
      })));
  }

  // finishJob(){
  //   return this.http.post<JobResponseData>( GlobalVariable.BASE_API_URL + '/finishJob', {master: this.jobMasterForm.value})
  //     .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobMaster}) => {
  //       console.log('finishJOb');
  //       console.log(response.data);
  //     })));
  // }


  finishJob(){
    return this.http.post<JobResponseData>( GlobalVariable.BASE_API_URL + '/finishJob', {master: this.jobMasterForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobMaster}) => {
        if(response.data){
          let index = this.savedJobsList.findIndex(x=> x.id === response.data.id);
          this.savedJobsList[index].status_id = response.data.status_id;
          this.finishedJobsList.unshift(this.savedJobsList[index]);
          this.savedJobsList.splice(index,1);

          this.finishedJobsSub.next([...this.finishedJobsList]);
          this.savedJobsSub.next([...this.savedJobsList]);
        }
      })));
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
      return throwError ({status: err.status, message: 'You are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
}

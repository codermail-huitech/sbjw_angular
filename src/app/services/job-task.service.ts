import {Injectable, OnDestroy} from '@angular/core';
import {GlobalVariable} from '../shared/global';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderDetail} from '../models/orderDetail.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {JobMaster} from '../models/jobMaster.model' ;
import {JobDetail} from 'src/app/models/jobDetail.model';
import {OrderMaster} from '../models/orderMaster.model';
import {OrderResponseData} from './order.service';
import {Material} from "../models/material.model";
import {JobResponseData} from "./job.service";

@Injectable({
  providedIn: 'root'
})
export class JobTaskService implements OnDestroy{

  jobTaskForm: FormGroup;
  jobMasterForm: FormGroup;
  materialData: Material[];

  // oneJobData: JobMaster[] = [];
  oneJobData: JobMaster = null;

  savedJobsList: JobMaster[] = [];
  finishedJobsList: JobMaster[] = [];
  jobMasterData: JobMaster;
  jobDetailData: JobDetail[];
  jobReturnData: JobDetail;
  totalData: JobDetail[];
  jobTransactionData: JobDetail[];

  // btnControl: boolean;
  btnControl = false;

  // finshBadgeValue = 0;
  // goldSendBadge = 1;
  // goldSendBadge = 1;
  // goldSendBadge = 1;
  jobBadgeArray = [];


  finshBadgeValue = 0;
  goldSendBadge = 0;
  goldRetBadge = 0;
  dalSendBadge = 0;
  dalRetBadge = 0;
  panSendBadge = 0;
  panRetBadge = 0;
  BronzeSendBadge = 0;
  nitricRetBadge = 0;

  private savedJobsSub = new Subject<JobMaster[]>();
  private materialDataSub = new Subject<Material[]>();
  private getJobTaskDataSub = new Subject<JobDetail[]>();
  private jobReturnDataSub = new Subject<JobDetail>();
  private totalDataSub = new Subject<JobDetail[]>();
  private jobTransactionSub = new Subject<JobDetail[]>();
  private finishedJobsSub = new Subject<JobMaster[]>();
  private oneJobDataSub = new Subject<JobMaster[]>();
  private badgeValueSub = new Subject<any>();
  private btnControlSub: Subject<boolean> = new Subject<boolean>();


  getSavedJobsUpdateListener(){
    return this.savedJobsSub.asObservable();
  }
  getFinishedJobsUpdateListener(){
    return this.finishedJobsSub.asObservable();
  }
  getJobTaskDataUpdateListener(){
    return this.getJobTaskDataSub.asObservable();
  }

  getTotalDataUpdateListener(){
    return this.totalDataSub.asObservable();
  }
  // getJobReturnDataUpdateListener(){
  //   return this.jobReturnDataSub.asObservable();
  // }
  getJobTransactionDataUpdateListener(){
    return this.jobTransactionSub.asObservable();
  }

  getMaterialDataUpdateListener(){
    return this.materialDataSub.asObservable();
  }


  constructor(private http: HttpClient) {
    this.btnControl = false;
    this.resolve(false);


    this.jobTaskForm = new FormGroup({
      id : new FormControl(null),
      // job_number : new FormControl(null, [Validators.required]),
      // approx_gold : new FormControl(null, [Validators.required]),
      // p_loss : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      // price : new FormControl(null, [Validators.required]),
      return_quantity : new FormControl(null, [Validators.required]),
      material_name : new FormControl({value: null, disabled: true}, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      job_Task_id : new FormControl(null, [Validators.required]),
      employee_id : new FormControl(null, [Validators.required])
    });



    //---------------------------

    this.jobMasterForm = new FormGroup({
      id : new FormControl(null),
      date : new FormControl(null, [Validators.required]),
      karigarh_id : new FormControl(null, [Validators.required]),
      gross_weight : new FormControl(null, [Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      model_number : new FormControl({value: null, disabled: true}, [Validators.required]),
      material_name : new FormControl({value: null, disabled: true}, [Validators.required])
    });



    //---------------------

    //fetching the orders which are sent to job

    this.http.get(GlobalVariable.BASE_API_URL + '/savedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.savedJobsSub.next([...this.savedJobsList]);
      });

    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.finishedJobsList = data;
        this.finishedJobsSub.next([...this.finishedJobsList]);
      });

    this.http.get(GlobalVariable.BASE_API_URL + '/materials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        this.materialDataSub.next([...this.materialData]);
      });
  }

  testObserble(){
    return this.btnControlSub.asObservable();
  }

  // testData(data) {
  //   if (data === true){
  //     this.btnControl = true;
  //   }
  //   this.resolve();
  // }

  resolve(data){
    this.btnControl = data;
    if (this.btnControl === true){
       this.btnControlSub.next(this.btnControl);
    }else{
      this.btnControl = false;
      this.btnControlSub.next(this.btnControl);
    }
  }

  getAllJobList(){

    return [...this.savedJobsList];
  }

  getFinishedJobList(){

    return [...this.finishedJobsList];
  }

  // getLatestBadgeValue(){
  //
  //   return [...this.jobBadgeArray];
  // }




  getMaterials(){
    return[...this.materialData];
  }

  ngOnDestroy(): void {
    this.getJobTaskDataSub.complete();
  }

  getUpdatedSavedJobs(){
    this.http.get(GlobalVariable.BASE_API_URL + '/savedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.savedJobsList = data;
        this.savedJobsSub.next([...this.savedJobsList]);
      });

  }

  getUpdatedFinishedJobs(){
    this.http.get(GlobalVariable.BASE_API_URL + '/finishedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.finishedJobsList = data;
        this.finishedJobsSub.next([...this.finishedJobsList]);
      });

  }

  jobReturn(){
      return this.http.post(GlobalVariable.BASE_API_URL + '/saveReturn', { data: this.jobTaskForm.value})
       .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail}) => {
             const {data} = response;
             this.jobReturnData = data;

            //  this.jobReturnDataSub.next([...this.jobReturnData]);
             let index = this.jobBadgeArray.findIndex(x => x.id === this.jobTaskForm.value.id);
             if (index === -1){
               this.goldSendBadge = this.goldSendBadge + 1;
               this.jobBadgeArray.push({id: this.jobTaskForm.value.id, GS: this.goldSendBadge, GR: 0, DS: 0, DR: 0, PS: 0, PR: 0, BS: 0, NR: 0, F: 0});
             }
             else{
               this.jobBadgeArray[index].GS = this.jobBadgeArray[index].GS + 1;
             }

             // this.jobBadgeArray.id = this.jobTaskForm.value.id;
             // this.jobBadgeArray.GS = this.goldSendBadge;

             console.log(this.jobBadgeArray);
             this.badgeValueSub.next(this.jobBadgeArray);
       })));


    // this.http.post(GlobalVariable.BASE_API_URL + '/saveReturn', { data : this.jobTaskForm.value})
    //   .subscribe((response: {success: number, data: JobDetail}) => {
    //     // const {data} = response;
    //     // if (data){
    //     //   this.jobTaskForm.reset();
    //     // }
    //     // this.jobDetailData.unshift(response.data);
    //
    //   });
  }



  // jobTaskData(task_id) {
  //   this.http.get(GlobalVariable.BASE_API_URL + '/getJobTaskData/' + task_id)
  //     .subscribe((response: {success: number, data: JobDetail[]}) => {
  //       const {data} = response;
  //       this.jobDetailData = data;
  //       this.getJobTaskDataSub.next([...this.jobDetailData]);
  //     });
  // }
  jobTaskData() {
    return this.http.post( GlobalVariable.BASE_API_URL + '/getJobTaskData', { data : this.jobTaskForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail[]}) => {
        const {data} = response;
        this.jobDetailData = data;
        this.getJobTaskDataSub.next([...this.jobDetailData]);
      })));
  }

  getTotal(){
    return this.http.post( GlobalVariable.BASE_API_URL + '/getTotal', { data : this.jobTaskForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail[]}) => {
        const {data} = response;
        this.totalData = data;
        this.totalDataSub.next([...this.totalData]);
      })));
  }

  getTotalData(){
    this.http.post( GlobalVariable.BASE_API_URL + '/getTotal', { data : this.jobTaskForm.value})
      .subscribe((response: {success: number, data: JobDetail[]}) => {
        const {data} = response;
        this.totalData = data;
        this.totalDataSub.next([...this.totalData]);
      });
  }

  getAllTransactions(data) {
    return this.http.get(GlobalVariable.BASE_API_URL + '/getAllTransactions/' + data)
      .pipe(catchError(this._serverError), tap(((response: { success: number, data: JobDetail[] }) => {
        this.jobTransactionData = response.data;
        this.jobTransactionSub.next([...this.jobTransactionData]);

      })));
  }
    getOneJobData(data){
      return this.http.get(GlobalVariable.BASE_API_URL + '/getOneJobData/' + data )
        .pipe(catchError(this._serverError), tap(((response: { success: number, data: JobMaster}) => {
          this.oneJobData = response.data;
        })));

    }


  getBadgeValue(){
    return this.badgeValueSub.asObservable();
  }


  // updateBadgeValue(jobTaskId){
  //   if(jobTaskId === 1){
  //     this.goldSendBadge = this.goldSendBadge + 1;
  //     this.badgeValueSub.next([...this.goldSendBadge]);
  //   }
  //   return 1;
  // }





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

import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Karigarh} from '../models/karigarh.model';
import {GlobalVariable} from '../shared/global';
import {Agent} from '../models/agent.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {OrderMaster} from '../models/orderMaster.model';

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
  karigarhData: Karigarh[] = [];
  orderMaster: OrderMaster[];

  // subject declaration
  private karigarhSub = new Subject<Karigarh[]>();

  getKarigarhUpdateListener(){
    return this.karigarhSub.asObservable();
  }

  constructor(private http: HttpClient) {

    this.jobMasterForm = new FormGroup({
      id : new FormControl(null),
      date : new FormControl(null, [Validators.required]),
      karigarh_id : new FormControl(null, [Validators.required]),
      gross_weight : new FormControl(null, [Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      model_number : new FormControl({value: null, disabled: true}, [Validators.required])
    });

    //fetching karigarhs
    this.http.get(GlobalVariable.BASE_API_URL + '/karigarhs')
      .subscribe((response: {success: number, data: Karigarh[]}) => {
        const {data} = response;
        this.karigarhData = data;
        this.karigarhSub.next([...this.karigarhData]);
      });

  }
}

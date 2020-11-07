import { Injectable } from '@angular/core';
import {Agent} from '../models/agent.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../models/product.model';
import {ProductResponseData} from './product.service';

export interface AgentResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})

export class AgentService {
  agentData: Agent[];
  agentForm: FormGroup;

  private agentSub = new Subject<Agent[]>();

  getAgentUpdateListener(){
    return this.agentSub.asObservable();
  }

  constructor(private http: HttpClient) {

    this.agentForm = new FormGroup({
      id : new FormControl(null),
      person_name : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      email : new FormControl(null, [Validators.required, Validators.email]),
      mobile1 : new FormControl('+91', [Validators.maxLength(13)]),
      mobile2 : new FormControl('+91', [Validators.maxLength(13)]),
      person_type_id : new FormControl(10),
      customer_category_id : new FormControl(2),
      address1 : new FormControl(null),
      address2 : new FormControl(null),
      state : new FormControl('West Bengal'),
      po : new FormControl(null),
      area : new FormControl(null),
      city : new FormControl(null),
      pin : new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]),
      opening_balance_LC : new FormControl(0.00),
      opening_balance_Gold : new FormControl(0.00),
    });

    this.http.get('http://127.0.0.1:8000/api/agents')
      .subscribe((response: {success: number, data: Agent[]}) => {
        // @ts-ignore
        const {data} = response;
        this.agentData = data;
        this.agentSub.next([...this.agentData]);
      });
  }

  fillAgentFormForEdit(data){
    this.agentForm.setValue(data);
  }

  saveAgent(){
    return this.http.post<AgentResponseData>('http://127.0.0.1:8000/api/agents', this.agentForm.value);
  }

  deleteAgent(id){
    return this.http.delete<AgentResponseData>('http://127.0.0.1:8000/api/agents/' + id);
  }

  updateAgent(){
    return this.http.patch<AgentResponseData>('http://127.0.0.1:8000/api/agents/' + this.agentForm.value.id, this.agentForm.value);
  }
}

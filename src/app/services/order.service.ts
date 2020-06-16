import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Agent} from "../models/agent.model";
import {Subject} from "rxjs";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Material} from "../models/material.model";



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderForm: FormGroup;
  materialData: Material[] = [];
  agentData: Agent[] = [];
  private agentSub = new Subject<Agent[]>();
  private materialSub=new Subject<Material[]>();

  getAgentUpdateListener(){
    console.log('customer listener called');
    return this.agentSub.asObservable();
  }

  getMaterialUpdateListener(){
    console.log('customer listener called');
    return this.materialSub.asObservable();
  }



  constructor(private http: HttpClient) {
    this.orderForm = new FormGroup({
      id : new FormControl(null),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      material_id : new FormControl(null, [Validators.required])
    });

    this.http.get('http://127.0.0.1:8000/api/agents')
      .subscribe((response: {success: number, data: Agent[]}) => {
        const {data} = response;
        this.agentData = data;
        this.agentSub.next([...this.agentData]);
      });

    this.http.get('http://127.0.0.1:8000/api/materials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        this.materialSub.next([...this.materialData]);
      });

  }
}

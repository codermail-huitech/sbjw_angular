import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobTaskService} from '../../../services/job-task.service';
import {AuthService} from '../../../services/auth.service';
import {JobService} from '../../../services/job.service';
import {JobMaster} from '../../../models/jobMaster.model';
import {FormGroup} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {Material} from '../../../models/material.model';
import {Karigarh} from '../../../models/karigarh.model';
import {User} from '../../../models/user.model';
import {JobDetail} from '../../../models/jobDetail.model';
import {BillService} from '../../../services/bill.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  sub: object;
  id: number;
  job_number: string;
  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  oneJobData: JobMaster;
  materialList: Material[];
  karigarhData: Karigarh[] = [];
  userData: User = null;
  karigarhName: string = null;
  totalData: JobDetail[];
  showTransactionDiv = false;
  jobTransactionData: JobDetail[];
  btnControl: boolean = null;
  tempTotalData = [0, 0 , 0 , 0 , 0 , 0, 0, 0];
  FGWt: number;

  // we have to change this values dynamically
  finshBadgeValue = 0;
  goldSendBadge = 0;
  goldRetBadge = 0;
  dalSendBadge = 0;
  dalRetBadge = 0;
  panSendBadge = 0;
  panRetBadge = 0;
  BronzeSendBadge = 0;
  nitricRetBadge = 0;


  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute , private  jobTaskService: JobTaskService , private  jobService: JobService , private  orderService: OrderService, private billService: BillService) {
    this.jobTaskService.testObserble().subscribe((response) => {
      this.btnControl = response;
      // console.log('test');
      // console.log(this.btnControl);
    });
    // console.log(this.jobTaskService.btnControl);
    this.karigarhData = this.jobService.getAllKarigarhs();
    this.FGWt = 0;
    // this. jobTaskService.getBadgeValue().subscribe((response) => {
    //   let index = response.findIndex(x => x.id === this.id);
    //   if (index === -1){
    //     this.goldSendBadge = 1;
    //   }
    //   else{
    //     this.goldSendBadge = response[index].GS;
    //   }
    // });

    // console.log(this.jobTaskService.getLatestBadgeValue());


    // this.FGWt = this.billService.FGWt;


  }

  printDivStyle = {
    table: {'border-collapse': 'collapse', width : '35%'},
    label: {width: '35%'},
    h1 : {color: 'red'},
    h2 : {border: 'solid 1px'},
    td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };


  ngOnInit(): void {
    this.showTransactionDiv = true;

    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.userData = JSON.parse(localStorage.getItem('user'));

    this.billService.getTotalGoldQuantityDataSubUpdateListener().subscribe((response) => {
      this.FGWt = response;
    });

    this.route.params.subscribe(params => {
      this.showTransactionDiv = false;
      // tslint:disable-next-line:radix
      this.id = parseInt(params.id);
      // console.log(this.id);
      this.jobTaskService.getOneJobData(this.id).subscribe((response: {success: number , data: JobMaster}) => {
        this.oneJobData = response.data;
        // console.log(this.oneJobData);
        this.jobTaskForm.patchValue({id: this.oneJobData.id});
        this.job_number = this.oneJobData.job_number;
        this.jobTaskForm.patchValue({size: this.oneJobData.size});
        const index1 = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
        this.karigarhName = this.karigarhData[index1].person_name;
        this.userData = JSON.parse(localStorage.getItem('user'));
        // tslint:disable-next-line:no-shadowed-variable
        this.orderService.getMaterialUpdateListener().subscribe((response) => {
          this.materialList = response;
          const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
          const materialData = this.materialList[index];
          this.jobTaskForm.patchValue({material_name: materialData.material_name});
        });
        // console.log(this.jobTaskForm.value);
      });


      this.jobTaskService.getBadgeValue().subscribe((response) => {
        this.finshBadgeValue = response.finshBadgeValue || 0;
        this.goldSendBadge = response.goldSendBadge;
        this.goldRetBadge = response.goldRetBadge;
        this.dalSendBadge = response.dalSendBadge;
        this.dalRetBadge = response.dalRetBadge;
        this.panSendBadge = response.panSendBadge;
        this.panRetBadge = response.panRetBadge;
        this.BronzeSendBadge = response.bronzeSendBadge;
        this.nitricRetBadge = response.nitricRetBadge;
      });
      this.jobTaskService.getBatchCount(params.id);

      this.jobTaskService.testObserble().subscribe((response) => {
        this.btnControl = response;
        //this can also be done
        // if(this.btnControl === true){
        //   this.oneJobData.status_id = 100;
        // }
      });
      //
      this.billService.getTotalGoldQuantity(this.id).subscribe((response) => {
        this.FGWt = response.data.data;
      });

      this.jobTaskForm.patchValue({id: params.id});


      this.jobTaskService.getUpdatedSavedJobs();
      this.jobTaskService.getUpdatedFinishedJobs();
      this.karigarhData = this.jobService.getAllKarigarhs();
      this.jobService.getKarigarhUpdateListener().subscribe((response) => {
        this.karigarhData = response;
      });
      this.jobTaskService.getSavedJobsUpdateListener().subscribe((response) => {
        this.savedJobsData = response;
        const index = this.savedJobsData.findIndex(x => x.id === this.id);
        // if (index === -1){
        //   this.jobTaskService.getFinishedJobsUpdateListener().subscribe((response) => {
        //     this.savedJobsData = response;
        //     const index = this.savedJobsData.findIndex(x => x.id === this.id);
        //     this.oneJobData = this.savedJobsData[index];
        //     this.jobTaskForm.patchValue({id: this.oneJobData.id});
        //     this.jobTaskForm.value.id = this.oneJobData.id;
        //     this.job_number = this.oneJobData.job_number;
        //     const index1 = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
        //     this.karigarhName = this.karigarhData[index1].person_name;
        //   });
        // }
        // else{
        //   this.oneJobData = this.savedJobsData[index];
        //   this.jobTaskForm.patchValue({id: this.oneJobData.id});
        //   this.job_number = this.oneJobData.job_number;
        // }
        // if (this.karigarhData && this.oneJobData){
        //   const index = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
        //   this.karigarhName = this.karigarhData[index].person_name;
        // }
      });
      // this.userData = JSON.parse(localStorage.getItem('user'));
      // this.orderService.getMaterialUpdateListener().subscribe((response) => {
      //   this.materialList = response;
      //   const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
      //   const materialData = this.materialList[index];
      //   this.jobTaskForm.patchValue({material_name: materialData.material_name , size: this.oneJobData.size});
      // });
      // this.karigarhData = this.jobService.getAllKarigarhs();
      // this.jobService.getKarigarhUpdateListener().subscribe((response) => {
      //   this.karigarhData = response;
      //   // console.log("karigarh data");
      //   // console.log(this.karigarhData);
      //   const index = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      //   this.karigarhName = this.karigarhData[index].person_name;
      //   // console.log(this.karigarhName);
      // });
      // console.log("component");
      // console.log(this.oneJobData);
      // if (this.oneJobData){
      //   // const index = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      //   // this.karigarhName = this.karigarhData[index].person_name;
      //   console.log("component");
      //   console.log(this.karigarhData);
      // }
      // console.log(this.karigarhData);
      this.jobTaskService.getTotalData();
      this.jobTaskService.getTotal().subscribe((response) => {
        this.totalData = response.data;
        for (let i = 1; i <= 8; i ++){
          const index = this.totalData.findIndex(x => x.id === i);
          if (index >= 0)
          {
            this.tempTotalData[i - 1] = this.totalData[index].total;
          }
          else{
            this.tempTotalData[i - 1] = 0;
          }
        }
        // console.log(this.tempTotalData);
      });
      this.jobTaskService.getTotalDataUpdateListener().subscribe((response) => {
        this.totalData = response;
        for (let i = 1; i <= 8; i ++){
          const index = this.totalData.findIndex(x => x.id === i);
          if (index >= 0)
          {
            this.tempTotalData[i - 1] = this.totalData[index].total;
          }
          else{
            this.tempTotalData[i - 1] = 0;
          }
        }
      });
      this.jobTaskService.getJobTransactionDataUpdateListener().subscribe((response) => {
        this.jobTransactionData = response;
      });
      this.jobTaskService.getAllTransactions(this.id).subscribe((response) => {
        this.jobTransactionData = response.data;
      });


    });




  }
}

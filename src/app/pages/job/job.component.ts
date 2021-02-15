import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {JobService} from '../../services/job.service';
import {Karigarh} from '../../models/karigarh.model';
import {Product} from '../../models/product.model';
import {OrderService} from '../../services/order.service';
import {OrderMaster} from '../../models/orderMaster.model';
import {OrderDetail} from '../../models/orderDetail.model';
import {DatePipe, formatDate} from '@angular/common';
import {Observable} from 'rxjs';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductService} from '../../services/product.service';
import {Material} from '../../models/material.model';
import Swal from "sweetalert2";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  jobMasterForm: FormGroup;
  jobDetailsForm: FormGroup;
  karigarhData: Karigarh[] = [];
  orderMasterData: OrderMaster[] = [];
  orderDetails: OrderDetail[];
  products: Product[];
  materialList: Material[] = [];
  showProduct = true;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');
  selectedJobIndex = -1;
  selectedJobItem: OrderDetail;

  new_job_date = new Date();
  job_date_format = formatDate(this.new_job_date , 'dd/MM/yyyy', 'en');

  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  constructor(private productService: ProductService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private jobService: JobService, private orderService: OrderService) {
    this.products = this.productService.getProducts();
    this.karigarhData = this.jobService.getAllKarigarhs();
    this.page = 1;
    this.pageSize = 15;
  }

  ngOnInit(): void {
    this.selectedJobIndex = -1;
    this.jobMasterForm = this.jobService.jobMasterForm;
    this.jobDetailsForm = this.jobService.jobDetailsForm;
    this.products = this.productService.getProducts();
    this.orderMasterData = this.orderService.getOrderMaster();
    this.jobService.getKarigarhUpdateListener().subscribe((responseProducts: Karigarh[]) => {
      this.karigarhData = responseProducts;
    });
    this.orderService.getOrderUpdateListener().subscribe((responseProducts: OrderMaster[]) => {
      this.orderMasterData = responseProducts;
    });
    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
        this.products = responseProducts;
      });
    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });
    this.materialList = this.orderService.getMaterials();
  }

  viewDetails(data) {
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.showProduct = false;
        this.orderDetails = orderDetails;
      });
  }

  productShow() {
    this.showProduct = !this.showProduct;
  }

  material_quantity_decimal(){
    const x = String(this.jobDetailsForm.value.material_quantity).split('.');
    if (!x[1]){
      this.jobDetailsForm.patchValue({material_quantity : (this.jobDetailsForm.value.material_quantity / 1000)});
    }
  }

  placeJob(details) {
    this.selectedJobIndex = this.orderDetails.findIndex(x => x.id === details.id);
    this.selectedJobItem = details;
    const index = this.materialList.findIndex(x => x.id === details.material_id);
    this.jobMasterForm.patchValue({
      model_number: details.model_number,
      order_details_id: details.id,
      material_name: this.materialList[index].material_name
    });
    const user = JSON.parse(localStorage.getItem('user'));
    this.jobDetailsForm.value.employee_id = user.id;
    this.jobDetailsForm.patchValue({material_id: details.material_id, id: details.id, employee_id: user.id});
    this.jobMasterForm.patchValue({date: this.job_date_format});
    // this.jobMasterForm.value.date = this.pipe.transform(this.jobMasterForm.value.date, 'yyyy-MM-dd');
  }

  onSubmit() {
    console.log(this.jobMasterForm.value);
    if(this.jobMasterForm.value.karigarh_id) {
      this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to send order to job ?')
        .then((confirmed) => {
          if (confirmed) {
            // this.jobMasterForm.value.date = this.pipe.transform(this.jobMasterForm.value.date, 'yyyy-MM-dd');
            this.jobMasterForm.value.date = this.pipe.transform(this.new_job_date, 'yyyy-MM-dd');
            // const user = JSON.parse(localStorage.getItem('user'));
            // this.jobDetailsForm.value.employee_id = user.id;
            let saveObserable = new Observable<any>();
            saveObserable = this.jobService.saveJob();
            saveObserable.subscribe((response) => {
              if (response.success === 1) {
                const index = this.orderDetails.findIndex(x => x.id === this.jobDetailsForm.value.id);
                this.orderDetails[index].status_id = 1;
                this.jobMasterForm.reset();
                this.jobDetailsForm.reset();
                this.jobService.getSavedJobsUpdateListener().subscribe();
                Swal.fire(
                  'Saved!',
                  'Order has been sent to job',
                  'success'
                );
                this.selectedJobIndex = -1;
              }
            }, (error) => {
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: error.message}
              });
            });
          }
        })
        .catch(() => {
          console.log('User dismissed the dialog (e.gf., by using ESC, clicking the cross icon, or clicking outside the dialog)');
        });
    }else{
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Failed to save'}
      });
    }
  }
  getBackgroundColor(index: number) {
    if (index === this.selectedJobIndex){
      return {
           'background-color': '#6b6b47',
           color: 'seashell'
         };
    }
  }
  onCancel(){
    this.jobMasterForm.reset();
    this.jobDetailsForm.reset();
    this.selectedJobIndex = -1;
  }






}

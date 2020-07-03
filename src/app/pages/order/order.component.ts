import { Component, OnInit } from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
// import {FormGroup} from "@angular/forms";
import {FormGroup} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {Agent} from '../../models/agent.model';
import {Material} from '../../models/material.model';
import { DatePipe } from '@angular/common';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {OrderDetail} from '../../models/orderDetail.model';
import {OrderMaster} from '../../models/orderMaster.model';
import {Observable} from 'rxjs';
import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})

export class OrderComponent implements OnInit {

  // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  customerList: Customer[];
  agentList: Agent[];
  materialList: Material[];
  products: Product[];
  orderDetails: OrderDetail[] = [];
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  // orderData: object;
  isSaveEnabled = true;
  orderData : OrderMaster[] = [];
  product_id: number;
  showProduct = true;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  startDate = new Date(2020, 0, 2);
  public currentError: any;

  pipe = new DatePipe('en-US');

  now = Date.now();


  // tslint:disable-next-line:max-line-length
  constructor(private confirmationDialogService: ConfirmationDialogService, private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private productService: ProductService, private _snackBar: MatSnackBar) {
  }
  onlyOdds = (d: Date): boolean => {
    const date = d.getDate();
    // Even dates are disabled.
    return true;
    return date % 2 === 0;
  }

  ngOnInit(): void {
    this.isSaveEnabled = true;
    this.orderMasterForm = this.orderService.orderMasterForm;
    this.orderDetailsForm = this.orderService.orderDetailsForm;
    // this.orderDetailsForm.controls['amount'].disable();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerList = customers;
      });

    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
        // this.materialList =  alasql("select * from ? where material_name='90 Ginnie' or material_name='92 Ginnie'", [this.materialList]);
      });

    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });

    this.orderService.getOrderUpdateListener()
      .subscribe((responseOrders: OrderMaster[]) => {
        this.orderData = responseOrders;
      });
  }

  updateMaster(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.masterUpdate().subscribe((response)=>{

      if (response.success === 1){
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Master Updated'}
        });
      }
      this.currentError = null;

    },(error) => {
      console.log('error occured ');
      console.log(error);
      this.currentError = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });


}


  addOrder(){
    const index = this.products.findIndex(x => x.model_number === this.orderDetailsForm.value.model_number);
    this.orderDetailsForm.value.product_id = this.products[index].id;
    this.orderService.setOrderDetails();
    this.orderDetailsForm.reset();
    this.orderDetailsForm.value.amount = null;
    this.orderDetails = this.orderService.orderDetails;
  }

  productShow(){
    this.showProduct = !this.showProduct;
  }

  fetchDetails(data){
    this.isSaveEnabled=false;
    this.showProduct = true;
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.orderDetails = orderDetails;
      });
    this.orderMasterForm.patchValue({id: data.id, customer_id : data.customer_id, agent_id: data.agent_id, order_date: data.date_of_order, delivery_date: data.date_of_delivery});
  }
  fillOrderDetailsForm(details){
    // this.orderDetailsForm.setValue(details);
    this.isSaveEnabled=false;
    this.orderDetailsForm.patchValue({id: details.id, model_number : details.model_number, p_loss: details.p_loss, price: details.price, price_code: details.price_code, quantity: details.quantity, amount: details.amount, approx_gold: details.approx_gold, size: details.size });
    this.product_id = details.product_id;
  }
  updateOrder(){
    // this.orderDetailsForm.value.product_id = this.product_id;
    if (this.orderDetailsForm.value.product_id === undefined){
      const index = this.products.findIndex(x => x.model_number === this.orderDetailsForm.value.model_number);
      this.orderDetailsForm.value.product_id = this.products[index].id;
    }
    this.orderService.setOrderDetailsForUpdate();
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.setOrderMasterData();
    this.orderService.updateOrder().subscribe((response) => {

      if(response.success===1){
        this.orderDetailsForm.reset();
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Details Updated'}
        });
      }
      this.currentError=null;

    },(error) => {
      console.log('error occured');
      console.log(error);
      this.currentError=error;

      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });

    });
    // this.orderService.getOrderDetailsUpdateListener()
    //   .subscribe((data: object) => {
    //     console.log(data);
    //   });
  }

  deleteOrderMaster(masterData){

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete order master ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){


          this.orderService.deleteOrderMaster(masterData.id).subscribe((response) => {
            if (response.success === 1){
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Order Deleted'}
              });
            }
            this.currentError = null;
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this.currentError = error;
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }
      })


      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
    console.log(masterData);
  }


  deleteDetails(details){
    // console.log(details);
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete order detail ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){
          this.orderService.deleteOrderDetails(details.id).subscribe((response) => {
            if (response.success === 1){
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Order Deleted'}
              });
            }
            this.currentError = null;
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this.currentError = error;
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }

      })
      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
  }
  findModel(){
    const index = this.products.findIndex(k => k.model_number === this.orderDetailsForm.value.model_number.toString().toUpperCase());
    if (index === -1){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'No Model Number Found'}
      });
    }
    if (index !== -1){
      const x = this.products[index];
      this.orderDetailsForm.patchValue({p_loss : x.p_loss, price_code : x.price_code_name, price : x.price});
    }
  }

  clearForm(){
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  onSubmit(){
    let saveObserable = new Observable<any>();
    saveObserable = this.orderService.saveOrder();
    saveObserable.subscribe((response) => {
      if (response.success === 1){
        this.orderMasterForm.reset();
        this.orderDetailsForm.reset();
        this.orderDetails = [];
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Saved'}
        });
      }
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }

  selectCustomerForOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.setOrderMasterData();
  }
}

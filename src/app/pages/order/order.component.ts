import { Component, OnInit } from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
// import {FormGroup} from "@angular/forms";
import {FormControl, FormGroup} from '@angular/forms';
import {OrderResponseData, OrderService} from '../../services/order.service';
import {Agent} from '../../models/agent.model';
import {Material} from '../../models/material.model';
import { DatePipe } from '@angular/common';
import {Product} from '../../models/product.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {OrderDetail} from '../../models/orderDetail.model';
import {OrderMaster} from '../../models/orderMaster.model';
import {Observable} from 'rxjs';
import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})

export class OrderComponent implements OnInit {

  customerList: Customer[];
  agentList: Agent[];
  materialList: Material[];
  products: Product[];

  productData: Product[] ;
  orderMaster: OrderMaster;
  orderDetails: OrderDetail[] = [];
  orderMasterList : OrderMaster[] = [];
  editableOrderMaster : OrderMaster;
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  isSaveEnabled = true;
  product_id: number;
  showProduct = true;
  showUpdate = false;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  startDate = new Date(2020, 0, 2);

  public currentError: any;

  pipe = new DatePipe('en-US');

  now = Date.now();
  public editableItemIndex = -1;
  public orderContainer: any;
  public totalOrderAmount = 0;
  public totalQuantity = 0;
  public totalApproxGold = 0;



  // tslint:disable-next-line:max-line-length
  constructor(private confirmationDialogService: ConfirmationDialogService, private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private _snackBar: MatSnackBar) {
    this.orderService.getOrderMaster();
  }
  // onlyOdds = (d: Date): boolean => {
  //   const date = d.getDate();
  //   // Even dates are disabled.
  //   return true;
  //   return date % 2 === 0;
  // }

  ngOnInit(): void {
    this.isSaveEnabled = true;
    this.orderMasterForm = this.orderService.orderMasterForm;
    this.orderDetailsForm = this.orderService.orderDetailsForm;
    // this.orderDetailsForm.controls['amount'].disable();
    this.showUpdate = false;
    // this.options = [];


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
      });
    this.orderService.getOrderUpdateListener()
      .subscribe((responseOrders: OrderMaster[]) => {
         this.orderMasterList = responseOrders;
      });
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetail)=>{
          this.orderDetails =orderDetail;
          this.totalApproxGold =0;
          this.totalOrderAmount =0;
          this.totalQuantity =0;
          for(let x =0; x< this.orderDetails.length; x++){
            this.totalApproxGold = this.totalApproxGold + this.orderDetails[x].approx_gold;
            this.totalQuantity = this.totalQuantity + this.orderDetails[x].quantity;
            this.totalOrderAmount = this.totalOrderAmount + this.orderDetails[x].amount;
          }
      });


    this.storage.get('orderContainer').subscribe((orderContainer: any) => {
      if (orderContainer){
        this.orderMaster = orderContainer.orderMaster;
        this.orderDetails = orderContainer.orderDetails;
        this.orderMasterForm.setValue(orderContainer.orderMasterFormValue);
        this.totalOrderAmount = orderContainer.totalAmount;
        this.totalQuantity = orderContainer.totalQuantity;
        this.totalApproxGold = orderContainer.totalApproxGold;
      }
    }, (error) => {});
  }
  updateMaster(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.masterUpdate().subscribe((response) => {

      if (response.success === 1){
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Master Updated'}
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


  addOrder(){
    this.orderMaster = this.orderMasterForm.value;
    if (this.editableItemIndex === -1){
      this.orderDetails.unshift(this.orderDetailsForm.value);
    }else{
      this.orderDetails[this.editableItemIndex] = this.orderDetailsForm.value;
    }
    // tslint:disable-next-line:max-line-length
    this.orderDetailsForm.patchValue({product_id: null, model_number: null, p_loss: null, price: null, price_code: null, approx_gold: null, size: null, quantity: null, amount: null});
    this.totalOrderAmount = this.orderDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + (record.price * record.quantity);
    }, 0);

    this.totalQuantity = this.orderDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + record.quantity;
    }, 0);

    this.totalApproxGold = this.orderDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + record.approx_gold;
    }, 0);
    // tslint:disable-next-line:max-line-length
    this.orderContainer = {
      orderMaster: this.orderMaster,
      orderDetails: this.orderDetails,
      orderMasterFormValue: this.orderMasterForm.value,
      totalAmount: this.totalOrderAmount,
      totalQuantity: this.totalQuantity,
      totalApproxGold: this.totalApproxGold
    };
    this.storage.set('orderContainer', this.orderContainer).subscribe(() => {});
  }

  productShow(){
    this.showProduct = !this.showProduct;
  }

  fetchDetails(data){
    console.log(data);
    this.isSaveEnabled = false;
    this.showProduct = true;
    this.showUpdate = true;
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.orderDetails = orderDetails;

      });
    // tslint:disable-next-line:max-line-length
    this.orderMasterForm.patchValue({id: data.id, customer_id : data.person_id, agent_id: data.agent_id, order_date: data.date_of_order, delivery_date: data.date_of_delivery});
  }
  fillOrderDetailsForm(item){
    // this.orderDetailsForm.setValue(item);

    this.editableItemIndex = this.orderDetails.findIndex(x => x === item);
    this.isSaveEnabled = false;

    const amount = item.quantity * item.price;
    // tslint:disable-next-line:max-line-length

    let index = this.orderMasterList.findIndex(x => x.id ===item.order_master_id);
    this.editableOrderMaster = this.orderMasterList[index];

    // this.editableOrderMaster.date_of_order = this.pipe.transform(this.editableOrderMaster.date_of_order,'dd/MM/yyyy');
    // this.editableOrderMaster.date_of_delivery = this.pipe.transform(this.editableOrderMaster.date_of_delivery,'dd/MM/yyyy');

    // console.log(this.editableOrderMaster);
    this.orderMasterForm.patchValue({id : this.editableOrderMaster.id, customer_id : this.editableOrderMaster.customer_id, agent_id : this.editableOrderMaster.agent_id, order_date : this.editableOrderMaster.date_of_order, delivery_date : this.editableOrderMaster.date_of_delivery});

    this.orderDetailsForm.patchValue({id: item.id, product_id: item.product_id, model_number : item.model_number, p_loss: item.p_loss, price: item.price, price_code: item.price_code, quantity: item.quantity, amount: item.amount, approx_gold: item.approx_gold, size: item.size });
    this.product_id = item.product_id;
  }
  getBackgroundColor(index: number) {
    // tslint:disable-next-line:triple-equals
    if (index == this.editableItemIndex){
      return {
        'background-color': 'rgba(200,29,55,0.6)',
        color: 'seashell'
      };
    }
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

      if (response.success === 1){
        this.orderDetailsForm.reset();
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Details Updated'}
        });
      }
      this.currentError = null;

    }, (error) => {
      console.log('error occured');
      console.log(error);
      this.currentError = error;

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
    // console.log(masterData);
  }


  deleteDetails(item){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Item will be deleted from order list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.orderService.deleteOrderDetails(item.id).subscribe((response: {data: OrderDetail, success: number}) => {
          if (response.data){
            const index = this.orderDetails.findIndex(x => x.id === response.data.id);
            this.totalApproxGold = this.totalApproxGold - this.orderDetails[index].approx_gold;
            this.totalQuantity = this.totalQuantity - this.orderDetails[index].quantity;
            this.totalOrderAmount = this.totalOrderAmount - this.orderDetails[index].amount;
            this.orderDetails.splice(index, 1);
            console.log(response.data);
            // this.totalApproxGold = this.totalApproxGold - this.orderDetails
            Swal.fire(
              'Deleted!',
              'Item deleted from Order List',
              'success'
            );
          }
        });

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order item is not deleted :)',
          'error'
        );
      }
    });
  }

  deleteDetailsLocal(index,data){


    Swal.fire({
      title: 'Are you sure?',
      text: 'Item will be deleted from order list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.totalOrderAmount = this.totalOrderAmount - data.amount;
        this.totalQuantity = this.totalQuantity - data.quantity;
        this.totalApproxGold = this.totalApproxGold - data.approx_gold;
        this.orderDetails.splice(index,1);

        this.orderContainer = {
          // orderMaster: this.orderMaster,
          orderDetails: this.orderDetails,
          orderMasterFormValue: this.orderMasterForm.value,
          totalAmount: this.totalOrderAmount,
          totalQuantity: this.totalQuantity,
          totalApproxGold: this.totalApproxGold
        };
        this.storage.set('orderContainer', this.orderContainer).subscribe(() => {});
            // this.totalApproxGold = this.totalApproxGold - this.orderDetails
        Swal.fire(
          'Deleted!',
          'Item deleted from Order List',
          'success'
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order item is not deleted :)',
          'error'
        );
      }
    });
  }

  findModel(event){
    const index = this.customerList.findIndex(k => k.id === this.orderMasterForm.value.customer_id );
    // tslint:disable-next-line:max-line-length
    this.orderService.getProductData(this.orderDetailsForm.value.model_number, this.customerList[index].customer_category_id)
      .subscribe((responseProducts: {success: number, data: Product}) => {
      // console.log(responseProducts);
      if (responseProducts.data){
        const tempProduct = responseProducts.data;
        // tslint:disable-next-line:max-line-length
        this.orderDetailsForm.patchValue({ product_id: tempProduct.id, p_loss: tempProduct.p_loss, price: tempProduct.price, price_code : tempProduct.price_code_name});
      }else{
        alert('This model does not exist');
        // this.productData = [];
        // tslint:disable-next-line:max-line-length
        this.orderDetailsForm.patchValue({ p_loss: null, price: null, price_code : null});
      }
    });
  }




  clearForm(){
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  onSubmit(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    // this.orderService.setOrderMasterData();

    this.orderMaster = this.orderMasterForm.value;

    this.orderService.saveOrder(this.orderMaster , this.orderDetails).subscribe((response) => {
        if (response.data){
          Swal.fire(
            'Saved!',
            'Order Successfully saved',
            'success'
          );
          this.storage.delete('orderContainer').subscribe(() => {});
          this.orderContainer = null;
          this.orderMaster = null;
          this.orderDetails = [];
          this.orderMasterForm.reset();
          this.orderDetailsForm.reset();
          this.totalOrderAmount = 0;
          this.totalQuantity = 0;
          this.totalApproxGold = 0;

          this.orderMasterList.unshift(response.data);
        }
    });

    // let saveObserable = new Observable<any>();
    // saveObserable = this.orderService.saveOrder(this.orderMaster , this.orderDetails);
    // saveObserable.subscribe((response) => {
    //   console.log(response);
    //   if (response.success === 1){
    //     this.orderMasterForm.reset();
    //     this.orderDetailsForm.reset();
    //     this.orderDetails = [];
    //     this._snackBar.openFromComponent(SncakBarComponent, {
    //       duration: 4000, data: {message: 'Order Saved'}
    //     });
    //     this.orderDetailsForm.value.amount = 0;
    //   }
    // }, (error) => {
    //   console.log('error occured ');
    //   console.log(error);
    //   this._snackBar.openFromComponent(SncakBarComponent, {
    //     duration: 4000, data: {message: error.message}
    //   });
    // });
  }

  cancelEditCurrentItem(item: OrderDetail) {
    this.editableItemIndex = -1;
  }

  // selectCustomerForOrder() {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   this.orderMasterForm.value.employee_id = user.id;
  //   this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
  //   this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
  //   this.orderService.setOrderMasterData();
  // }
  cancelOrder() {
    this.storage.delete('orderContainer').subscribe(() => {});
    this.orderContainer = null;
    this.orderMaster = null;
    this.orderDetails = [];
    this.totalOrderAmount = 0;
    this.totalQuantity = 0;
    this.totalApproxGold = 0;
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  updateItemAmount() {
    console.log('quantity changed');
    const calculatedAmount = (this.orderDetailsForm.value.quantity * this.orderDetailsForm.value.price);
    this.orderDetailsForm.patchValue({amount: calculatedAmount});
  }

  showOrderDetailsList(item){

    this.orderService.fetchOrderDetails(item.id);
    this.showProduct = true;

  }
}

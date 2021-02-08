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
import {ExcelService} from '../../services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {  ViewChild, ElementRef } from '@angular/core';
import {ProductService} from '../../services/product.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})

export class OrderComponent implements OnInit {

  @ViewChild('htmlData') htmlData: ElementRef;

  customerList: Customer[];
  agentList: Agent[];
  materialList: Material[];
  products: Product[];

  productData: Product[] ;
  orderMaster: OrderMaster;
  orderDetails: OrderDetail[] = [];
  orderMasterList: OrderMaster[] = [];
  editableOrderMaster: OrderMaster;
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  isSaveEnabled = true;
  showDeveloperDiv = true;
  product_id: number;
  showProduct = false;
  showUpdate = false;
  isAddEnabled = true;
  yourModelDate: string;
  productList: Product[];
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

  public searchTerm: string;
  filter = new FormControl('');
  page: number;
  pageSize: number;
  p = 1;

  // tslint:disable-next-line:max-line-length
  constructor(private confirmationDialogService: ConfirmationDialogService, private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private _snackBar: MatSnackBar , private  excelService: ExcelService, private  productService: ProductService) {
    this.orderMasterList = this.orderService.getOrderMaster();
    this.customerList = this.customerService.getCustomers();
    this.agentList = this.orderService.getAgentList();
    this.materialList = this.orderService.getMaterials();
    this.productList = this.productService.getProducts();
    this.page = 1;
    this.pageSize = 15;
  }

  printDivStyle = {
    table: {'border-collapse': 'collapse' , width: '100%'},
    h1 : {color: 'red'},
    h2 : {border: 'solid 1px'},
    td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };

  ngOnInit(): void {
    this.isSaveEnabled = true;
    this.orderMasterForm = this.orderService.orderMasterForm;
    this.orderDetailsForm = this.orderService.orderDetailsForm;
    this.showUpdate = false;

    this.showProduct = false;
    this.isAddEnabled = true;

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
    this.productService.getProductUpdateListener().subscribe((response)=>{
      this.productList  = response;
      console.log(this.productList);
    });
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetail) => {
          this.orderDetails = orderDetail;
          this.totalApproxGold = 0;
          this.totalOrderAmount = 0;
          this.totalQuantity = 0;
        // tslint:disable-next-line:prefer-for-of
          for (let x = 0; x < this.orderDetails.length; x++){
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
      this.currentError = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }

  material_quantity_decimal(){
    const x = String(this.orderDetailsForm.value.approx_gold).split('.');
    if (!x[1]){
      this.orderDetailsForm.patchValue({approx_gold : (this.orderDetailsForm.value.approx_gold / 1000)});
    }
  }

  addOrder(){
    this.showProduct = true;
    if (this.orderMasterForm.value.id){
        this.orderDetails = [];
        this.orderMasterForm.value.id = null;
    }
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
  }

  productShow(){
    this.showProduct = !this.showProduct;
  }

  fillOrderDetailsForm(item){
    this.editableItemIndex = this.orderDetails.findIndex(x => x === item);
    this.isSaveEnabled = false;
    const amount = item.quantity * item.price;
    // tslint:disable-next-line:max-line-length

    const index = this.orderMasterList.findIndex(x => x.id === item.order_master_id);
    this.editableOrderMaster = this.orderMasterList[index];

    this.orderMasterForm.patchValue({id : this.editableOrderMaster.id, customer_id : this.editableOrderMaster.customer_id, agent_id : this.editableOrderMaster.agent_id, order_date : this.editableOrderMaster.date_of_order, delivery_date : this.editableOrderMaster.date_of_delivery});

    this.orderDetailsForm.patchValue({id: item.id, product_id: item.product_id, model_number : item.model_number, p_loss: item.p_loss, price: item.price, price_code: item.price_code, quantity: item.quantity, amount: item.amount, approx_gold: item.approx_gold, size: item.size , material_id: item.material_id});
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
        Swal.fire(
          'Updated!',
          'Item updated in Order List',
          'success'
        );

        this.orderDetailsForm.reset();
      }
      this.currentError = null;

    }, (error) => {
      this.currentError = error;

      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });

    });
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

  deleteDetailsLocal(index, data){
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
        this.orderDetails.splice(index, 1);

        this.orderContainer = {
          orderDetails: this.orderDetails,
          orderMasterFormValue: this.orderMasterForm.value,
          totalAmount: this.totalOrderAmount,
          totalQuantity: this.totalQuantity,
          totalApproxGold: this.totalApproxGold
        };
        this.storage.set('orderContainer', this.orderContainer).subscribe(() => {});
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

  findModel(){
    const index = this.customerList.findIndex(k => k.id === this.orderMasterForm.value.customer_id );
    // tslint:disable-next-line:max-line-length
    console.log(this.orderDetailsForm.value.model_number);
    console.log(this.customerList[index].customer_category_id);
    this.orderService.getProductData(this.orderDetailsForm.value.model_number, this.customerList[index].customer_category_id)
      .subscribe((responseProducts: {success: number, data: Product}) => {
      if (responseProducts.data){
        const tempProduct = responseProducts.data;
        // tslint:disable-next-line:max-line-length
        this.orderDetailsForm.patchValue({ product_id: tempProduct.id, p_loss: tempProduct.p_loss, price: tempProduct.price, price_code : tempProduct.price_code_name , discount : tempProduct.discount});
      }else{
        alert('This model does not exist for this customer');
        // tslint:disable-next-line:max-line-length
        this.orderDetailsForm.patchValue({ p_loss: null, price: null, price_code : null, discount : null});
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


          // this.orderMasterList.unshift(response.data);
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
    this.isAddEnabled = false;



  }

  OrderListToExcel(){
    this.excelService.simpleExportToExcel(this.orderMasterList, 'Orders.xlsx');
  }
  ConvertToPdf(){
    const DATA = this.htmlData.nativeElement;
    const doc = new jsPDF('p', 'pt', 'a1');
    // doc.text('My PDF Table', 5, 5);
    const handleElement = {
      '#editor'(element, renderer){
        return true;
      }
    };
    doc.fromHTML(DATA.innerHTML, 10, 10, {
      width: 500,
      elementHandlers: handleElement,
    });

    doc.save('OrderList.pdf');
  }

  ConvertToExcel(){

    const head = [
      {header: 'Id', key: 'id', width: 10},
      {header: 'Order Number', key: 'order_number', width: 32},
      {header: 'Customer', key: 'customer_name', width: 40},
      {header: 'Agent', key: 'agent_name', width: 40},
      {header: 'Order Date', key: 'date_of_order', width: 20},
      {header: 'Delivery Date', key: 'date_of_delivery', width: 20},
    ];
    this.excelService.exportToExcelSpecial(this.orderMasterList, 'Orders', head);
  }
}

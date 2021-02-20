import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './pages/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MaterialModule } from './core/material.module';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductComponent } from './pages/product/product.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { HomeComponent } from './pages/home/home.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PictureCarouselComponent } from './pages/home/picture-carousel/picture-carousel.component';
import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthComponent } from './pages/auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import {AuthInterceptorInterceptor} from './services/auth-interceptor.interceptor';
import { OwnerComponent } from './pages/owner/owner.component';
import {NgxPrintModule} from 'ngx-print';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { SncakBarComponent } from './common/sncak-bar/sncak-bar.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { LoaidngRippleComponent } from './shared/loaidng-ripple/loaidng-ripple.component';
import { LoaidngEllipsisComponent } from './shared/loaidng-ellipsis/loaidng-ellipsis.component';
import { LoaidngHourglassComponent } from './shared/loaidng-hourglass/loaidng-hourglass.component';
import { LoaidngRollerComponent } from './shared/loaidng-roller/loaidng-roller.component';
import { OrderComponent } from './pages/order/order.component';

import { DateAdapter } from '@angular/material/core';
import { DateFormat } from './date-format';
import { JobComponent } from './pages/job/job.component';
import { JobTaskComponent } from './pages/job/job-task/job-task.component';
import { JobDetailComponent } from './pages/job/job-detail/job-detail.component';
import { GoldSubmitComponent } from './pages/job/job-detail/gold-submit/gold-submit.component';
import { GoldReturnComponent } from './pages/job/job-detail/gold-return/gold-return.component';
import { PanSubmitComponent } from './pages/job/job-detail/pan-submit/pan-submit.component';
import { PanReturnComponent } from './pages/job/job-detail/pan-return/pan-return.component';
import { DalReturnComponent } from './pages/job/job-detail/dal-return/dal-return.component';
import { DalSubmitComponent } from './pages/job/job-detail/dal-submit/dal-submit.component';
import { NitricReturnComponent } from './pages/job/job-detail/nitric-return/nitric-return.component';
import { BronzeSubmitComponent } from './pages/job/job-detail/bronze-submit/bronze-submit.component';
import { JobTransactionComponent } from './pages/job/job-detail/job-transaction/job-transaction.component';
import { FinishJobComponent } from './pages/job/job-detail/finish-job/finish-job.component';
import { BillComponent } from './pages/bill/bill.component';
import { BillOrderDetailsComponent } from './pages/bill/bill-order-details/bill-order-details.component';
import { BillJobMasterDetailsComponent } from './pages/bill/bill-job-master-details/bill-job-master-details.component';
import { CompletedBillComponent } from './pages/completed-bill/completed-bill.component';
import { CompletedBillOrderDetailsComponent } from './pages/completed-bill/completed-bill-order-details/completed-bill-order-details.component';
import { CompletedBillDetailsComponent } from './pages/completed-bill/completed-bill-details/completed-bill-details.component';
import { RateComponent } from './pages/rate/rate.component';
import { StockComponent } from './pages/stock/stock.component';
import { StockBillComponent } from './pages/stock-bill/stock-bill.component';
import { AgentComponent } from './pages/agent/agent.component';
import { AgentAllocationComponent } from './pages/agent-allocation/agent-allocation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { GoldPaymentComponent } from './pages/gold-payment/gold-payment.component';
import { DueByAgentComponent } from './pages/due-by-agent/due-by-agent.component';
import { CustomerUnderAgentComponent } from './pages/due-by-agent/customer-under-agent/customer-under-agent.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { EmployeeStockComponent } from './pages/employee-stock/employee-stock.component';
import { FooterComponent } from './pages/footer/footer.component';
import {NgSelectModule} from "@ng-select/ng-select";
import { BilledJobListComponent } from './pages/completed-bill/billed-job-list/billed-job-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductComponent,
    CustomerComponent,
    HomeComponent,
    PictureCarouselComponent,
    CustomerListComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    OwnerComponent,
    SncakBarComponent,
    ConfirmationDialogComponent,
    LoaidngRippleComponent,
    LoaidngEllipsisComponent,
    LoaidngHourglassComponent,
    LoaidngRollerComponent,
    OrderComponent,
    JobComponent,
    JobTaskComponent,
    JobDetailComponent,
    GoldSubmitComponent,
    GoldReturnComponent,
    PanSubmitComponent,
    PanReturnComponent,
    DalReturnComponent,
    DalSubmitComponent,
    NitricReturnComponent,
    BronzeSubmitComponent,
    JobTransactionComponent,
    FinishJobComponent,
    BillComponent,
    BillOrderDetailsComponent,
    BillJobMasterDetailsComponent,
    CompletedBillComponent,
    CompletedBillOrderDetailsComponent,
    CompletedBillDetailsComponent,
    RateComponent,
    StockComponent,
    StockBillComponent,
    AgentComponent,
    AgentAllocationComponent,
    PaymentComponent,
    GoldPaymentComponent,
    DueByAgentComponent,
    CustomerUnderAgentComponent,
    TransactionComponent,
    EmployeeStockComponent,
    FooterComponent,
    BilledJobListComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true},
              {provide: DateAdapter, useClass: DateFormat} ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}

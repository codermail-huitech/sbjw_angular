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
import { NitricSubmitComponent } from './pages/job/job-detail/nitric-submit/nitric-submit.component';
import { NitricReturnComponent } from './pages/job/job-detail/nitric-return/nitric-return.component';


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
    NitricSubmitComponent,
    NitricReturnComponent

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
    NgxPaginationModule
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

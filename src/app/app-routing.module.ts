import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {CustomerComponent} from './pages/customer/customer.component';
import {ProductComponent} from './pages/product/product.component';
import {OrderComponent} from './pages/order/order.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuardService} from './services/auth-guard.service';
import {OwnerComponent} from './pages/owner/owner.component';
import {JobComponent} from './pages/job/job.component';
import { JobTaskComponent } from './pages/job/job-task/job-task.component';
import { JobDetailComponent } from './pages/job/job-detail/job-detail.component';
import {GoldSubmitComponent} from "./pages/job/job-detail/gold-submit/gold-submit.component";
import {GoldReturnComponent} from "./pages/job/job-detail/gold-return/gold-return.component";
import {DalSubmitComponent} from "./pages/job/job-detail/dal-submit/dal-submit.component";
import {DalReturnComponent} from "./pages/job/job-detail/dal-return/dal-return.component";
import {PanSubmitComponent} from "./pages/job/job-detail/pan-submit/pan-submit.component";
import {PanReturnComponent} from "./pages/job/job-detail/pan-return/pan-return.component";
import {NitricReturnComponent} from "./pages/job/job-detail/nitric-return/nitric-return.component";
import {BronzeSubmitComponent} from "./pages/job/job-detail/bronze-submit/bronze-submit.component";
import {JobTransactionComponent} from "./pages/job/job-detail/job-transaction/job-transaction.component";
import {FinishJobComponent} from "./pages/job/job-detail/finish-job/finish-job.component";
import {BillComponent} from "./pages/bill/bill.component";
import {BillOrderDetailsComponent} from "./pages/bill/bill-order-details/bill-order-details.component";
import {BillJobMasterDetailsComponent} from './pages/bill/bill-job-master-details/bill-job-master-details.component';
import {CompletedBillComponent} from "./pages/completed-bill/completed-bill.component";
import {CompletedBillOrderDetailsComponent} from "./pages/completed-bill/completed-bill-order-details/completed-bill-order-details.component";
import {CommonJsUsageWarnPlugin} from "@angular-devkit/build-angular/src/angular-cli-files/plugins/common-js-usage-warn-plugin";
import {CompletedBillDetailsComponent} from "./pages/completed-bill/completed-bill-details/completed-bill-details.component";
import {RateComponent} from './pages/rate/rate.component';
import {StockComponent} from './pages/stock/stock.component';
import {StockBillComponent} from './pages/stock-bill/stock-bill.component';
import {AgentComponent} from './pages/agent/agent.component';
import {AgentAllocationComponent} from './pages/agent-allocation/agent-allocation.component';
import {PaymentComponent} from './pages/payment/payment.component';
import {GoldPaymentComponent} from './pages/gold-payment/gold-payment.component';
import {DueByAgentComponent} from './pages/due-by-agent/due-by-agent.component';
import {CustomerUnderAgentComponent} from './pages/due-by-agent/customer-under-agent/customer-under-agent.component';
import {TransactionComponent} from './pages/transaction/transaction.component';
import {EmployeeStockComponent} from './pages/employee-stock/employee-stock.component';
import {BilledJobListComponent} from './pages/completed-bill/billed-job-list/billed-job-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customer', canActivate:  [AuthGuardService], component: CustomerComponent},
  {path: 'agent', canActivate:  [AuthGuardService], component: AgentComponent},
  {path: 'product', canActivate:  [AuthGuardService], component: ProductComponent},
  {path: 'rate', canActivate:  [AuthGuardService], component: RateComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'owner', canActivate:  [AuthGuardService], component: OwnerComponent},
  {path: 'order', canActivate:  [AuthGuardService], component: OrderComponent},
  {path: 'job', canActivate:  [AuthGuardService], component: JobComponent},
  {path: 'job_task', canActivate : [AuthGuardService], component: JobTaskComponent},
  {path: 'cash_payment', canActivate : [AuthGuardService], component: PaymentComponent},
  {path: 'gold_payment', canActivate : [AuthGuardService], component: GoldPaymentComponent},
  {path: 'due_by_agent', canActivate : [AuthGuardService], component: DueByAgentComponent,
    // children: [
    //   {path: 'customer_under_agent/:id', canActivate : [AuthGuardService], component: CustomerUnderAgentComponent},
    // ],
  },
  {path: 'customer_under_agent/:id', canActivate : [AuthGuardService], component: CustomerUnderAgentComponent},
  {path: 'completed_bill_details/:id', canActivate : [AuthGuardService], component: CompletedBillDetailsComponent},
  {path: 'billedJobList/:id', canActivate : [AuthGuardService], component: BilledJobListComponent},
  {path: 'job_detail/:id', canActivate : [AuthGuardService], component: JobDetailComponent,
    children: [
      {path: '', component: JobTransactionComponent},
      {path: 'goldSubmit', component: GoldSubmitComponent},
      {path: 'goldReturn', component: GoldReturnComponent},
      {path: 'dalSubmit', component: DalSubmitComponent},
      {path: 'dalReturn', component: DalReturnComponent},
      {path: 'panSubmit', component: PanSubmitComponent},
      {path: 'panReturn', component: PanReturnComponent},
      {path: 'nitricReturn', component: NitricReturnComponent},
      {path: 'bronzeSubmit', component: BronzeSubmitComponent},
      {path: 'job_transaction', component: JobTransactionComponent},
      {path: 'job_finish', component: FinishJobComponent}
      // {path: 'albums', component: ArtistAlbumListComponent},
    ]
  },
  {path: 'bill', canActivate : [AuthGuardService], component: BillComponent},
  {path: 'bill_order_details/:id', canActivate:  [AuthGuardService], component: BillOrderDetailsComponent,
    children: [
      {path: 'bill_jobMaster_details/:id', component: BillJobMasterDetailsComponent}
    ],
  },
  // {path: 'bill_jobMaster_details/:id',canActivate : [AuthGuardService], component: BillJobMasterDetailsComponent},
  {path: 'completed_bills', canActivate : [AuthGuardService], component: CompletedBillComponent},
  {path: 'completed_bill_order_details/:id', canActivate:  [AuthGuardService], component: CompletedBillOrderDetailsComponent,
    children: [
      {path: 'completed_bill_details/:id', component: CompletedBillDetailsComponent}
    ],
  },
  {path: 'stock/:id', canActivate: [AuthGuardService], component: StockComponent },
  {path: 'stock', canActivate: [AuthGuardService], component: StockComponent },
  {path: 'agentAllocation', canActivate: [AuthGuardService], component: AgentAllocationComponent },
  {path: 'stockBill', canActivate: [AuthGuardService], component: StockBillComponent },
  {path: 'transaction', canActivate: [AuthGuardService], component: TransactionComponent },
  {path: 'employeeStock', canActivate: [AuthGuardService], component: EmployeeStockComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

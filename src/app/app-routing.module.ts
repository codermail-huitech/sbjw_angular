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

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customer', canActivate:  [AuthGuardService], component: CustomerComponent},
  {path: 'product', canActivate:  [AuthGuardService], component: ProductComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'owner', canActivate:  [AuthGuardService], component: OwnerComponent},
  {path: 'order', canActivate:  [AuthGuardService], component: OrderComponent},
  {path: 'job', canActivate:  [AuthGuardService], component: JobComponent},
  {path: 'job_task',canActivate : [AuthGuardService], component: JobTaskComponent},
  {path: 'job_detail/:id',canActivate : [AuthGuardService], component: JobDetailComponent,
    children: [
      {path: 'goldSubmit', component: GoldSubmitComponent},
      {path: 'goldReturn', component: GoldReturnComponent},
      // {path: 'albums', component: ArtistAlbumListComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

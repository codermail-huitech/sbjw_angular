import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() deviceXs: boolean;
  userSub: Subscription;
  isAuthenticated = false;
  isOwner = false;
  isManager = false;
  isWorker = false;
  isWorkshopManager = false;
  isSalesManager = false;
  isAccountManager = false;
  isOfficeStaff = false;
  router: Router;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user){
        this.isAuthenticated = user.isAuthenticated;
        this.isOwner = user.isOwner;
        this.isManager = user.isManager;
        this.isWorker = user.isWorker;
        this.isWorkshopManager = user.isWorkshopManager;
        this.isSalesManager = user.isSalesManager;
        this.isAccountManager = user.isAccountManager;
        this.isOfficeStaff = user.isOfficeStaff;
      }else{
        this.isAuthenticated = false;
        this.isOwner = false;
        this.isManager = false;
        this.isWorker = false;
        this.isWorkshopManager = false;
        this.isSalesManager = false;
        this.isAccountManager = false;
        this.isOfficeStaff = false;
      }
    });
    // console.log(this.userSub);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  myStyle(){
    // return {'background-color': '#e83d44'};
    return {
      // 'background-color': 'rgba(255,0,0,' + (10 / 100) + ')',
      'background-color': 'rgba(147,112,219,.3)',
      color : 'white'
    };
  }
}

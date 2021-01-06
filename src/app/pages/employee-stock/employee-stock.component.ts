import { Component, OnInit } from '@angular/core';
import {EmployeeStockService} from '../../services/employee-stock.service';

@Component({
  selector: 'app-employee-stock',
  templateUrl: './employee-stock.component.html',
  styleUrls: ['./employee-stock.component.scss']
})
export class EmployeeStockComponent implements OnInit {

  employeeStockList: any;
  public searchTerm: any;
  constructor(public  employeeStockService: EmployeeStockService ) { }

  ngOnInit(): void {
     this.employeeStockService.getEmployeeStockDataUpdateListener().subscribe((response) => {
       this.employeeStockList = response;
       console.log(this.employeeStockList);
     });
  }

}

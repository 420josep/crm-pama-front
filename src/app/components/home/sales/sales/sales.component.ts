import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales.service';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { SaleList } from 'src/app/templates/sale';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalSales: number = 0;
  offset: number = 0;
  sales: SaleList[] = [];

  constructor(
    private authService: AuthService, 
    private salesService: SalesService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getSales('');
  }

  getSales( text: string){
    this.salesService.getTotalSales( text ).subscribe( total => {
        this.totalSales = total;
    });

    this.salesService.getSales( text, this.offset ).subscribe(sales => {
      this.sales = [];
      this.sales = sales;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getSales('');
  }

  searchClient(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getSales(this.searchField);
      }
    }else{
      this.getSales('');
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getSales('');
  }

  trackBySaleID(index: number, sale: any) {
    return sale.id;
  }

}

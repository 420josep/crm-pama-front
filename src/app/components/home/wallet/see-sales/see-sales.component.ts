import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales.service';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { PendingSaleList } from 'src/app/templates/sale';

@Component({
  selector: 'app-see-sales',
  templateUrl: './see-sales.component.html',
  styleUrls: ['./see-sales.component.css']
})
export class SeeSalesComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalSales: number = 0;
  offset: number = 0;
  sales: PendingSaleList[] = [];

  constructor(
    private authService: AuthService, 
    private salesService: SalesService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getSales('');
  }

  getSales( text: string){
    this.salesService.getTotalPendingSales( text ).subscribe( total => {
        this.totalSales = total;
    });

    this.salesService.getPendingSales( text, this.offset ).subscribe(sales => {
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

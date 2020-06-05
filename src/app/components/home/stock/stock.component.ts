import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { StockItem } from 'src/app/templates/products';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  searchField: string = '';
  totalProducts: number;
  offset: number = 0;
  products: StockItem[];
  currentUser: User;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getProducts('');
  }

  
  getProducts( text: string){
    this.productsService.getTotalStockProducts( text ).subscribe( total => {
      this.totalProducts = total;
      console.log(this.totalProducts);
    });

    this.productsService.getStockProducts( text, this.offset ).subscribe(products => {
      this.products = products;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getProducts('');
  }

  deleteSearch(){
    this.searchField = '';
    this.getProducts('');
  }

  searchProduct(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getProducts(this.searchField);
      }
    }else{
      this.getProducts('');
    }
  }
}

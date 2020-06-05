import { Component, OnInit } from '@angular/core';
import { ProductListItem } from 'src/app/templates/products';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalProducts: number;
  offset: number = 0;
  products: ProductListItem[];

  constructor(
    private authService: AuthService, 
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getProducts('');
  }

  getProducts( text: string){
    this.productsService.getTotalProducts( text ).subscribe( total => {
        this.totalProducts = total;
    });

    this.productsService.getProducts( text, this.offset ).subscribe(products => {
      this.products = products;
    });
  }

  deleteProduct( productID: number, productName: string) {
    let confirm = window.confirm(`¿Eliminamos el producto "${productName}"?`);
    if (confirm) {
      this.productsService.deleteProduct(productID.toString()).subscribe( response => {
        if(response['response']){
          this.getProducts('');
        }
      });
    }
  }

  updatePaginator( event ){
    this.offset = event.offset;
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
  
  deleteSearch(){
    this.searchField = '';
    this.getProducts('');
  }
}

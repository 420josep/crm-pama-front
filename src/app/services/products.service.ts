import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { PresentationType, ProductListItem, Product, StockItem } from '../templates/products';
import { ProductSaleList } from '../templates/sale';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  currentUser: User;
  //server = 'http://localhost/crm_pama_back/';

  // Deploy
  server = 'https://crm-pama-back.herokuapp.com/';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  getPresentationTypes() {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "1");


    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
      };

    return this.http.get<PresentationType[]>(this.server + 'get_products.php', httpOptions).pipe(map(categories => {
        if (categories) {
            let items: PresentationType[] = [];
            for (let index = 0; index < categories.length; index++) {
                const item: PresentationType = {
                    id: +categories[index].id,
                    description: categories[index].description,
                    abbreviated: categories[index].abbreviated,
                }
                items.push(item);
            }
            return items;
        }else {
            return [];
        }
    }));
  }

  /** POST: add a new hero to the database */
  createProduct(json: any) {
    return this.http.post(this.server + 'create_product.php', json, httpOptions);
  }

  getTotalProducts( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "2")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_products.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));;
  }

  getProducts( text: string, offset: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "3")
    .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ProductListItem[]>(this.server + 'get_products.php', httpOptions).pipe(map( response => {
      if(response){
        let array: ProductListItem[] = [];
        for (let index = 0; index < response.length; index++) {

          if(this.currentUser.type === 1) {
            const item: ProductListItem = {
              id: +response[index].id,
              name: response[index].name,
              brand: response[index].brand,
              content: response[index].content,
              price: +response[index].price,
              company: response[index].company,
              creationUser: response[index].creationUser,
              state: response[index].state,
            }
            array.push(item);
          } else {
            const item: ProductListItem = {
              id: +response[index].id,
              name: response[index].name,
              brand: response[index].brand,
              content: response[index].content,
              price: response[index].price,
              company: '',
              creationUser: '',
              state: response[index].state,
            }
            array.push(item);
          }
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  getProduct( productID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "4")
    .set('productID', productID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Product>(this.server + 'get_products.php', httpOptions).pipe(map( response => {
      if(response){
          let creationDate = response.creationDate;
          creationDate = this.tools.sqlToDate(creationDate, 1);

          if(this.currentUser.type === 1) {
            const item: Product = {
              id: +response.id,
              name: response.name,
              brand: response.brand,
              presentationID: +response.presentationID,
              content: response.content,
              price: +response.price,
              companyID: +response.companyID,
              creationDate: creationDate,
              state: response.state,
            }
            return item;
          } else {
            const item: Product = {
              id: +response.id,
              name: response.name,
              brand: response.brand,
              presentationID: +response.presentationID,
              content: response.content,
              price: +response.price,
              companyID: +response.companyID,
              creationDate: creationDate,
              state: response.state,
            }
            return item;
          }
        
      }else {
        return;
      }

    }));;
  }

  updateProduct( data: any ) {
    let json = JSON.stringify(data);
    return this.http.post(this.server + 'update_product.php', json, httpOptions);
  }

  deleteProduct(productID: string) {
    const object = {
      productID: productID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_product.php', json, httpOptions);
  }

  //Corregir esta parte dejar solo una opción
  getProductsList( companyID: number, option: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', companyID.toString())
    .set('case', option.toString())
    .set('option', "5");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get<ProductSaleList[]>(this.server + 'get_products.php', httpOptions).pipe(map(response => {
        if (response) {
          let items: ProductSaleList[] = [];
          if(option === 1 ){
            for (let index = 0; index < response.length; index++) {
                const item: ProductSaleList = {
                    id: +response[index].id,
                    name: response[index].name,
                    price: 0,
                    stock: 0
                }
                items.push(item);
            }
            return items;
          } else {
            for (let index = 0; index < response.length; index++) {
                const item: ProductSaleList = {
                    id: +response[index].id,
                    name: response[index].name,
                    price: +response[index].price,
                    stock: 0,
                }
                items.push(item);
            }
            return items;
          }

        }else {
            return [];
        }
    }));
  }

  getTotalStockProducts( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "6")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_products.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));;
  }

  getStockProducts( text: string, offset: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "7")
    .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<StockItem[]>(this.server + 'get_products.php', httpOptions).pipe(map( response => {
      if(response){
        let array: StockItem[] = [];
        for (let index = 0; index < response.length; index++) {

          if(this.currentUser.type === 1) {
            const item: StockItem = {
              name: response[index].name,
              brand: response[index].brand,
              company: response[index].company,
              branch: response[index].branch,
              stock: +response[index].stock,
            }
            array.push(item);
          } else {
            const item: StockItem = {
              name: response[index].name,
              brand: response[index].brand,
              company: '',
              branch: response[index].branch,
              stock: +response[index].stock,
            }
            array.push(item);
          }
        }
        return array;
      }else {
        return [];
      }

    }));
  }
}

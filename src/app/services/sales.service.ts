import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { ListItem } from '../templates/global';
import { stringify } from 'querystring';
import { ProductSaleList, SaleList, Sale, EditProductSale } from '../templates/sale';
import { ToolsService } from './tools.service';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json; UTF8',
  })
}
@Injectable({
  providedIn: 'root'
})
export class SalesService {
  currentUser: User;
  server = 'http://localhost/health-back/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.authService.currentUser.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
   }

  getSaleStatus() {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "1");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_sales.php', httpOptions).pipe(map(response => {
        if (response) {
            let items: ListItem[] = [];
            for (let index = 0; index < response.length; index++) {
                const item: ListItem = {
                    id: +response[index].id,
                    name: response[index].name,
                }
                items.push(item);
            }
            return items;
        }else {
            return [];
        }
    }));
  }

  getPaymentMethods() {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "2");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_sales.php', httpOptions).pipe(map(response => {
        if (response) {
            let items: ListItem[] = [];
            for (let index = 0; index < response.length; index++) {
                const item: ListItem = {
                    id: +response[index].id,
                    name: response[index].name,
                }
                items.push(item);
            }
            return items;
        }else {
            return [];
        }
    }));
  }

  createSale(sale: any) {
    return this.http.post(this.server + 'create_sale.php', sale, httpOptions);
  }

  getProductsStock( branchID: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('branchID', branchID.toString())
    .set('option', "8");

    let headers = new HttpHeaders(
      {
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json; UTF8'
    });
    const httpOptions = {
        headers: headers,
        params: params,
    };

    return this.http.get<ProductSaleList[]>(this.server + 'get_products.php', httpOptions).pipe(map(response => {
        if (response) {
          let items: ProductSaleList[] = [];
            for (let index = 0; index < response.length; index++) {
                const item: ProductSaleList = {
                    id: +response[index].id,
                    name: response[index].name,
                    price: +response[index].price,
                    stock: +response[index].stock,
                }
                items.push(item);
            }
            return items;
        }else {
            return [];
        }
    }));
  }

  getTotalSales( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "3")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  getSales( text: string, offset: number ) {
    //console.log('id' ,this.currentUser.id.toString());
    //console.log('companyID', this.currentUser.companyID.toString());
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "4")
    .set('offset', offset.toString());

    let headers = new HttpHeaders(
      {
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      "Expires": "Sat, 01 Jan 2000 00:00:00 GMT",
      'Content-Type': 'application/json; UTF8'
    });
    const httpOptions = {
        headers: headers,
        params: params,
    };

    return this.http.get<SaleList[]>(this.server + 'get_sales.php?random=' + (new Date()).getTime(), httpOptions).pipe(map( response => {
      if(response){
        let array: SaleList[] = [];
        for (let index = 0; index < response.length; index++) {
          let company, branch = "";
          let date = response[index].date;
          date = this.tools.sqlToDate(date, 2);

          if(this.currentUser.type === 1) {
            company = response[index].company;
            branch = response[index].branch;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response[index].branch;
          } else {
            company = "";
            branch = "";
          }
          const item: SaleList = {
            id: +response[index].id,
            date: date,
            billNumber: +response[index].billNumber,
            client: response[index].client,
            total: +response[index].total,
            branch: branch,
            company: company,
            status: response[index].status,
            payment: response[index].payment,
          }
          array.push(item);
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  getSale( saleID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "5")
    .set('saleID', saleID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Sale>(this.server + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
          let company = "";
          let branch, companyID = 0;
          if(this.currentUser.type === 1) {
            company = response.company;
            companyID = +response.companyID;
            branch = +response.branchID;
          } else if(this.currentUser.type === 2) {
            company = "";
            companyID = 0;
            branch = +response.branchID;
          } else {
            company = "";
            companyID = 0;
            branch = 0;
          }
          let products: EditProductSale[] = [];
          for (let index = 0; index < response.products.length; index++) {
            const item: EditProductSale = {
              id: +response.products[index].id,
              product: response.products[index].product,
              productPrice: +response.products[index].productPrice,
              quantity: +response.products[index].quantity,
            }
            products.push(item);
          }

          const item: Sale = {
            id: +response.id,
            date: response.date,
            clientID: +response.clientID,
            total: +response.total,
            billNumber: +response.billNumber,
            branchID: branch,
            companyID: companyID,
            company: company,
            statusID: +response.statusID,
            paymentID: +response.paymentID,
            observation: response.observation,
            products: products
          }
          return item;
        
      }else {
        return;
      }

    }));;
  }

  updateSale( data: any ) {
    //let json = JSON.stringify(data);
    //console.log(json);
    return this.http.post(this.server + 'update_sale.php', data, httpOptions);
  }

  deleteSaleProduct(saleDetailID: number) {
    const object = {
      saleDetailID: saleDetailID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_sale_product.php', json, httpOptions);
  }


}

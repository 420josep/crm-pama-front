import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { ListItem } from '../templates/global';
import { ProductSaleList, SaleList, Sale, EditProductSale, PartialPaymentDescription, PendingSaleList, PendingSaleItem, SaleForPartialPayments } from '../templates/sale';
import { ToolsService } from './tools.service';
import { environment } from 'src/environments/environment';

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

    return this.http.get<ListItem[]>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map(response => {
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

    return this.http.get<ListItem[]>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map(response => {
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
    return this.http.post(environment.apiURL + 'create_sale.php', sale, httpOptions);
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

    return this.http.get<ProductSaleList[]>(environment.apiURL + 'get_products.php', httpOptions).pipe(map(response => {
        if (response) {
          let items: ProductSaleList[] = [];
            for (let index = 0; index < response.length; index++) {
                const item: ProductSaleList = {
                    id: +response[index].id,
                    name: response[index].name,
                    price: +response[index].price,
                    stock: +response[index].stock,
                    iva: response[index].iva
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

    return this.http.get<number>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
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
    
    return this.http.get<SaleList[]>(environment.apiURL + 'get_sales.php?random=' + (new Date()).getTime(), httpOptions).pipe(map( response => {
      if(response){
        let array: SaleList[] = [];
        for (let index = 0; index < response.length; index++) {
          let company, branch, creationUser = "";
          let date = response[index].date;
          date = this.tools.sqlToDate(date, 2);

          if(this.currentUser.type === 1) {
            company = response[index].company;
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else {
            company = "";
            branch = "";
            creationUser = "";
          }
          const item: SaleList = {
            id: +response[index].id,
            date: date,
            billNumber: +response[index].billNumber,
            client: response[index].client,
            direction: response[index].direction,
            phone: response[index].phone,
            useMobile: response[index].useMobile,
            total: +response[index].total,
            branch: branch,
            company: company,
            statusID: +response[index].statusID,
            status: response[index].status,
            paymentID: +response[index].paymentID,
            payment: response[index].payment,
            creationUser: creationUser,
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

    return this.http.get<Sale>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        //console.log(response);
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
            productID: +response.products[index].productID,
            product: response.products[index].product,
            productPrice: +response.products[index].productPrice,
            quantity: +response.products[index].quantity,
            iva: response.products[index].iva
          }
          products.push(item);
        }

        let partialPayment: PartialPaymentDescription[] = [];
        for (let index = 0; index < response.partialPayments.length; index++) {
          const item: PartialPaymentDescription = {
            id: +response.partialPayments[index].id,
            date: this.tools.sqlToDate(response.partialPayments[index].date, 3),
            value: +response.partialPayments[index].value,
            creationUser: response.partialPayments[index].creationUser,
          }
          partialPayment.push(item);
        }

        const item: Sale = {
          id: +response.id,
          date: this.tools.sqlToDate(response.date, 3),
          clientID: +response.clientID,
          total: +response.total,
          realTotal: +response.realTotal,
          billNumber: +response.billNumber,
          branchID: branch,
          companyID: companyID,
          company: company,
          statusID: +response.statusID,
          paymentID: +response.paymentID,
          observation: response.observation,
          discountValue: +response.discountValue,
          ivaValue: +response.ivaValue,
          products: products,
          partialPayments: partialPayment
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
    return this.http.post(environment.apiURL + 'update_sale.php', data, httpOptions);
  }

  deleteSaleProduct(saleDetailID: number) {
    const object = {
      saleDetailID: saleDetailID,
    };
    const json = JSON.stringify(object);
    return this.http.post(environment.apiURL + 'delete_sale_product.php', json, httpOptions);
  }

  getTotalPendingSales( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "6")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  getPendingSales( text: string, offset: number ) {
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
    
    return this.http.get<PendingSaleList[]>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        let array: PendingSaleList[] = [];
        for (let index = 0; index < response.length; index++) {
          let company, branch, creationUser = "";
          let date = response[index].date;
          let dateLastPartialPayment = response[index].dateLastPartialPayment;
          date = this.tools.sqlToDate(date, 2);
          dateLastPartialPayment = (!dateLastPartialPayment) ? dateLastPartialPayment : this.tools.sqlToDate(dateLastPartialPayment, 2);

          if(this.currentUser.type === 1) {
            company = response[index].company;
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else {
            company = "";
            branch = "";
            creationUser = "";
          }
          const item: PendingSaleList = {
            id: +response[index].id,
            date: date,
            billNumber: +response[index].billNumber,
            client: response[index].client,
            direction: response[index].direction,
            phone: response[index].phone,
            useMobile: response[index].useMobile,
            total: +response[index].total,
            branch: branch,
            company: company,
            paymentID: +response[index].paymentID,
            payment: response[index].payment,
            creationUser: creationUser,
            totalPartialPayments: +response[index].totalPartialPayments,
            dateLastPartialPayment: dateLastPartialPayment,
            valueLastPartialPayment: +response[index].valueLastPartialPayment,
            pendingToPay: +response[index].pendingToPay
          }
          array.push(item);
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  searchPendingSale( companyID: string, branchID: string, text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', companyID)
    .set('branchID', branchID)
    .set('word', text)
    .set('option', "8")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<PendingSaleItem[]>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        let array: PendingSaleItem[] = [];
        for (let index = 0; index < response.length; index++) {
          let date = response[index].date;
          date = this.tools.sqlToDate(date, 2);

          const item: PendingSaleItem = {
            id: +response[index].id,
            date: date,
            billNumber: +response[index].billNumber,
            client: response[index].client,
            total: +response[index].total,
            pendingToPay: +response[index].pendingToPay,
          }
          array.push(item);
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  getSaleForPartialPayments( saleID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('saleID', saleID)
    .set('option', "9");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };
    
    return this.http.get<SaleForPartialPayments>(environment.apiURL + 'get_sales.php', httpOptions).pipe(map( response => {
      if(response){
        let company, branch, creationUser = "";
        let date = response.date;
        date = this.tools.sqlToDate(date, 2);

        if(this.currentUser.type === 1) {
          company = response.company;
          branch = response.branch;
          creationUser = response.creationUser;
        } else if(this.currentUser.type === 2) {
          company = "";
          branch = response.branch;
          creationUser = response.creationUser;
        } else {
          company = "";
          branch = "";
          creationUser = "";
        }

        let partialPayment: PartialPaymentDescription[] = [];
        for (let index = 0; index < response.partialPayments.length; index++) {
          const item: PartialPaymentDescription = {
            id: +response.partialPayments[index].id,
            date: this.tools.sqlToDate(response.partialPayments[index].date, 3),
            value: +response.partialPayments[index].value,
            creationUser: response.partialPayments[index].creationUser,
          }
          partialPayment.push(item);
        }

        const item: SaleForPartialPayments = {
          date: date,
          billNumber: +response.billNumber,
          client: response.client,
          total: +response.total,
          branch: branch,
          company: company,
          payment: response.payment,
          totalPartialPayments: +response.totalPartialPayments,
          pendingToPay: +response.pendingToPay,
          partialPayments: partialPayment,
          creationUser: creationUser,
        }
        return item;
      }else {
        return null;
      }
    }));
  }
}

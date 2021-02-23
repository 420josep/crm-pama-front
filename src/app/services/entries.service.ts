import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';
import { EntriesList, Entry, ProductEntry } from '../templates/entries';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) { 
    this.currentUser = this.authService.getUser;
  }

  createEntry(entry: any) {
    return this.http.post(environment.apiURL + 'create_entry.php', entry, httpOptions);
  }

  getTotalEntries( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "1")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(environment.apiURL + 'get_entries.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));;
  }

  getEntries( text: string, offset: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "2")
    .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<EntriesList[]>(environment.apiURL + 'get_entries.php', httpOptions).pipe(map( response => {
      if(response){
        let array: EntriesList[] = [];
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

          const item: EntriesList = {
            id: +response[index].id,
            date: date,
            billNumber: +response[index].billNumber,
            total: +response[index].total,
            provider: response[index].provider,
            branch: branch,
            company: company,
            creationUser: creationUser
          }
          array.push(item);
        }
        return array;
      }else {
        return [];
      }
    }));
  }

  getEntry( entryID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "3")
    .set('entryID', entryID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Entry>(environment.apiURL + 'get_entries.php', httpOptions).pipe(map( response => {
      if(response){
        let date = response.date;
        let company, creationUser = "";
        let companyID, branchID = 0;
        date = this.tools.sqlToDate(date, 3);

        if(this.currentUser.type === 1) {
          company = response.company;
          companyID = +response.companyID;
          branchID = +response.branchID;
          creationUser = response.creationUser;
        } else if(this.currentUser.type === 2) {
          company = "";
          companyID = 0;
          branchID = +response.branchID;
          creationUser = response.creationUser;
        } else {
          company = "";
          companyID = 0;
          branchID = 0;
          creationUser = "";
        }
        
        let products: ProductEntry[] = [];
        for (let index = 0; index < response.products.length; index++) {
          const item: ProductEntry = {
            id: +response.products[index].id,
            productID: +response.products[index].productID,
            unitValue: +response.products[index].unitValue,
            quantity: +response.products[index].quantity,
          }
          products.push(item);
        }

        const item: Entry = {
          id: +response.id,
          date: date,
          billNumber: +response.billNumber,
          total: +response.total,
          providerID: +response.providerID,
          branchID: +branchID,
          companyID: +companyID,
          company: company,
          creationUser: creationUser,
          products: products
        }
        return item;
        
      }else {
        return;
      }

    }));;
  }

  deleteEntry(entryID: number) {
    const object = {
      entryID: entryID,
    };
    const json = JSON.stringify(object);
    return this.http.post(environment.apiURL + 'delete_entry.php', json, httpOptions);
  }

  updateEntry( data: any ) {
    //let json = JSON.stringify(data);
    //console.log(json);
    return this.http.post(environment.apiURL + 'update_entry.php', data, httpOptions);
  }

  deleteSaleProduct(entryDetailID: number) {
    const object = {
      entryDetailID: entryDetailID,
    };
    const json = JSON.stringify(object);
    return this.http.post(environment.apiURL + 'delete_entry_product.php', json, httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';
import { EntriesList, Entry, ProductEntry } from '../templates/entries';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  server = 'http://localhost/health-back/';
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) { 
    this.currentUser = this.authService.getUser;
  }

  createEntry(entry: any) {
    return this.http.post(this.server + 'create_entry.php', entry, httpOptions);
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

    return this.http.get<number>(this.server + 'get_entries.php', httpOptions).pipe(map( response => {
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

    return this.http.get<EntriesList[]>(this.server + 'get_entries.php', httpOptions).pipe(map( response => {
      if(response){
        let array: EntriesList[] = [];
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
          const item: EntriesList = {
            id: +response[index].id,
            date: date,
            billNumber: response[index].billNumber,
            provider: response[index].provider,
            branch: branch,
            company: company,
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

    return this.http.get<Entry>(this.server + 'get_entries.php', httpOptions).pipe(map( response => {
      console.log(response);
      if(response){
        let date = response.date;
        date = this.tools.sqlToDate(date, 2);
        let company, branch = "";
        if(this.currentUser.type === 1) {
          company = response.company;
          branch = response.branch;
        } else if(this.currentUser.type === 2) {
          company = "";
          branch = response.branch;
        } else {
          company = "";
          branch = "";
        }
        
        let products: ProductEntry[] = [];
        for (let index = 0; index < response.products.length; index++) {
          const item: ProductEntry = {
            product: response.products[index].product,
            quantity: +response.products[index].quantity,
          }
          products.push(item);
        }

        const item: Entry = {
          id: +response.id,
          date: date,
          billNumber: response.billNumber,
          provider: response.provider,
          branch: branch,
          company: company,
          creationUser: response.creationUser,
          products: products
        }
        return item;
        
      }else {
        return;
      }

    }));;
  }
}

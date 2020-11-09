import { Injectable } from '@angular/core';
import { Provider, ProviderListItem } from '../templates/provider';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProviderServices {
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) { 
    this.currentUser = this.authService.getUser;
  }

  /** POST: add a new hero to the database */
  addProvider(provider: Provider) {
    return this.http.post(environment.apiURL + 'create_provider.php', provider, httpOptions);
  }

  /** POST: add a new hero to the database */
  getProviders( text: string, offset: number ) {
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

    return this.http.get<ProviderListItem[]>(environment.apiURL + 'get_providers.php', httpOptions).pipe(map( response => {
      if(response){
        let array: ProviderListItem[] = [];
        for (let index = 0; index < response.length; index++) {

          if(this.currentUser.type === 1) {
            const item: ProviderListItem = {
              id: +response[index].id,
              name: response[index].name,
              nick: response[index].nick,
              manager: response[index].manager,
              phone: response[index].phone,
              creationUser: response[index].creationUser,
              company: response[index].company,
              state: response[index].state,
            }
            array.push(item);
          } else {
            const item: ProviderListItem = {
              id: +response[index].id,
              name: response[index].name,
              nick: response[index].nick,
              manager: response[index].manager,
              phone: response[index].phone,
              creationUser: '',
              company: '',
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

  getTotalProviders( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "1")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(environment.apiURL + 'get_providers.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  getProvider( providerID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "3")
    .set('providerID', providerID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Provider>(environment.apiURL + 'get_providers.php', httpOptions).pipe(map( response => {
      if(response){
          let creationDate = response.creationDate;
          creationDate = this.tools.sqlToDate(creationDate, 1);

          if(this.currentUser.type === 1) {
            const item: Provider = {
              id: +response.id,
              name: response.name,
              nick: response.nick,
              businessName: response.businessName,
              nit: response.nit,
              manager: response.manager,
              phone: response.phone,
              description: response.description,
              companyID: +response.companyID,
              state: response.state,
              creationDate: creationDate
            }
            return item;
          } else {
            const item: Provider = {
              id: +response.id,
              name: response.name,
              nick: response.nick,
              businessName: response.businessName,
              nit: response.nit,
              manager: response.manager,
              phone: response.phone,
              description: response.description,
              companyID: 0,
              state: true,
              creationDate: creationDate
            }
            return item;
          }
        
      }else {
        return;
      }

    }));;
  }

  updateProvider( data: any ) {
    let json = JSON.stringify(data);
    console.log(json);
    return this.http.post(environment.apiURL + 'update_provider.php', json, httpOptions);
  }

  /** DELETE: delete the hero from the server */
  deleteProvider(providerID: number) {
    const object = {
      providerID: providerID,
    };
    const json = JSON.stringify(object);
    return this.http.post(environment.apiURL + 'delete_provider.php', json, httpOptions);
  }

  getProvidersList( companyID: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', companyID.toString())
    .set('option', "4");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get<ListItem[]>(environment.apiURL + 'get_providers.php', httpOptions).pipe(map(response => {
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
}

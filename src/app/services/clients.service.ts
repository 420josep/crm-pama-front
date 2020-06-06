import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClientListItem, Client } from '../templates/clients';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';
import { User } from '../templates/user';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
  })
}
@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  server = 'http://localhost/crm_pama_back/';
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  createClient(client: any) {
    return this.http.post(this.server + 'create_client.php', client, httpOptions);
  }

  getTotalClients( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "1")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_clients.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));;
  }

  getClients( text: string, offset: number ) {
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

    return this.http.get<ClientListItem[]>(this.server + 'get_clients.php', httpOptions).pipe(map( response => {
      if(response){
        let array: ClientListItem[] = [];
        for (let index = 0; index < response.length; index++) {

          if(this.currentUser.type === 1) {
            const item: ClientListItem = {
              id: +response[index].id,
              name: response[index].name,
              discount: +response[index].discount,
              direction: response[index].direction,
              phone: response[index].phone,
              company: response[index].company,
              state: response[index].state,
            }
            array.push(item);
          } else {
            const item: ClientListItem = {
              id: +response[index].id,
              name: response[index].name,
              discount: +response[index].discount,
              direction: response[index].direction,
              phone: response[index].phone,
              company: '',
              state: '',
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

  deleteClient(clientID: string) {
    const object = {
      clientID: clientID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_client.php', json, httpOptions);
  }

  getClient( clientID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "3")
    .set('clientID', clientID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Client>(this.server + 'get_clients.php', httpOptions).pipe(map( response => {
      if(response){
          let creationDate = response.creationDate;
          creationDate = this.tools.sqlToDate(creationDate,1);

          if(this.currentUser.type === 1) {
            const item: Client = {
              id: +response.id,
              firstName: response.firstName,
              lastName: response.lastName,
              dni: response.dni,
              discount: +response.discount,
              direction: response.direction,
              phone: response.phone,
              companyID: +response.companyID,
              creationDate: creationDate,
              state: response.state,
            }
            return item;
          } else {
            const item: Client = {
              id: +response.id,
              firstName: response.firstName,
              lastName: response.lastName,
              dni: response.dni,
              discount: +response.discount,
              direction: response.direction,
              phone: response.phone,
              companyID: 0,
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

  updateClient( data: any ) {
    let json = JSON.stringify(data);
    return this.http.post(this.server + 'update_client.php', json, httpOptions);
  }

  getClientsList( companyID: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', companyID.toString())
    .set('option', "4");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_clients.php', httpOptions).pipe(map(response => {
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

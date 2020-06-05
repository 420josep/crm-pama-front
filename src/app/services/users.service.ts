import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User, UserListItem } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { AuthService } from './auth.service';
import { ListItem } from '../templates/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  server = 'http://localhost/health-back/';
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  /** POST: add a new hero to the database */
  addUser(user: User) {
    return this.http.post(this.server + 'create_user.php', user, httpOptions);
  }

  /** POST: add a new hero to the database */
  getUsers(text: string, offset: number) {
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
    
    return this.http.get<UserListItem[]>(this.server + 'get_users.php', httpOptions).pipe(map( response => {
      if(response){
        let arrayUsers: UserListItem[] = [];
        for (let index = 0; index < response.length; index++) {
          let lastConnection = response[index].lastConnection;
          if(lastConnection){
            lastConnection = this.tools.sqlToDate(lastConnection, 1);
          }else {
            lastConnection = "";
          }

          if (this.currentUser.type === 1) {
            let state = response[index]['state']==='1'? 'Activo': 'Inactivo';
            const userItem: UserListItem = {
              id: +response[index].id,
              name: response[index].name,
              username: response[index].username,
              company: response[index].company,
              branch: response[index].branch,
              city: response[index].city,
              type: response[index].type,
              lastConnection: lastConnection,
              state: state,
            }
            arrayUsers.push(userItem);
          } else {
            const userItem: UserListItem = {
              id: +response[index].id,
              name: response[index].name,
              username: '',
              company: '',
              branch: response[index].branch,
              city: response[index].city,
              type: response[index].type,
              lastConnection: lastConnection,
              state: '',
            }
            arrayUsers.push(userItem);
          }

        }
        return arrayUsers;
      }else {
        return [];
      }

    }));
  }

  getTotalUsers(text: string) {
    const params = new HttpParams()
      .set('userID', this.currentUser.id.toString())
      .set('companyID', this.currentUser.companyID.toString())
      .set('word', text)
      .set('option', "1");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };
    
    return this.http.get<number>(this.server + 'get_users.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  deleteUser( userID: number) {
    const object = {
      userID: userID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_user.php', json, httpOptions);
  }

  updateUser(data: User) {
    let json = JSON.stringify(data);
    return this.http.post(this.server + 'update_user.php', json, httpOptions);
  }

  getUser( userID: string ) {
    const params = new HttpParams()
      .set('userID', this.currentUser.id.toString())
      .set('companyID', this.currentUser.companyID.toString())
      .set('id', userID)
      .set('option', "3");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };
    
    return this.http.get<User>(this.server + 'get_users.php', httpOptions).pipe(map( response => {
      if(response){
        let lastConnection = response.lastConnection;
        if(lastConnection){
          lastConnection = this.tools.sqlToDate(lastConnection, 1);
        }else {
          lastConnection = "";
        }

        const item: User = {
          id: +response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          companyID: +response.companyID,
          branchID: +response.branchID,
          dni: response.dni,
          email: response.email,
          phone: response.phone,
          username: response.username,
          creationDate: response.creationDate,
          type: +response.type,
          lastConnection: lastConnection,
          state: response.state,
        }
        return item;
      }else {
        return;
      }
    }));
  }

  getUserTypes() {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "4");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_users.php', httpOptions).pipe(map( response => {
      if(response){
        let array: ListItem[] = [];
        for (let index = 0; index < response.length; index++) {
          const item: ListItem = {
            id: +response[index].id,
            name: response[index].name,
          }
          array.push(item);
        }        
        return array;
      }else {
        return [];
      }

    }));
  }
}

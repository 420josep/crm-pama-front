import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../templates/user';
import { ToolsService } from './tools.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' })
};

@Injectable({  providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  //server = 'http://localhost/crm_pama_back/';

  // Deploy
  server = 'https://crm-pama-back.herokuapp.com/';
  
  private loggedIn = false;

  constructor( 
      private http: HttpClient,
      private router: Router,
      private tools: ToolsService
    ) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.getUser == null ? (this.loggedIn = false): (this.loggedIn = true);
  }

  get isLoggedIn(): Boolean {
    return this.loggedIn;
  }

  public get getUser(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.get(this.server+'login.php', { responseType: 'json', params }).pipe( map( res => 
    {
        if( res['response'] ){
          this.saveUser( res['message'] );
          res['message'] = '';
          return res;
        }else{ 
          return res;
        }
    }));
  }

  saveUser( user: User ){
    let lastConnection = user.lastConnection;
    if(lastConnection){
      lastConnection = this.tools.sqlToDate(lastConnection, 1);
    }else {
      lastConnection = "";
    }
    const newUser: User = {
      id: +user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyID: +user.companyID,
      companyLogo: user.companyLogo,
      company: user.company,
      branchID: +user.branchID,
      branch: user.branch,
      dni: user.dni,
      email: user.email,
      phone: user.phone,
      username: user.username,
      creationDate: user.creationDate,
      type: +user.type,
      lastConnection: lastConnection,
      state: user.state,
    }
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    this.loggedIn = true;
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.loggedIn = false;
      this.router.navigate(['/login']);
  }

}

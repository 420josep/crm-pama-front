import { Component, OnInit } from '@angular/core';
import { UserListItem, User } from 'src/app/templates/user';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  searchField: string = '';
  totalUsers: number;
  offset: number = 0;
  users: UserListItem[];
  currentUser: User;

  constructor( 
    private usersServices: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUsers('');
    this.currentUser = this.authService.getUser;
  }

  getUsers( text: string){
    this.usersServices.getTotalUsers( text ).subscribe( total => {
      this.totalUsers = total;
    });

    this.usersServices.getUsers( text, this.offset ).subscribe(user => {
      this.users = user;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getUsers('');
  }

  searchUser(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getUsers(this.searchField);
      }
    }else{
      this.getUsers('');
    }
  }

  deleteUser( userID: number, userName: string) {
    let confirm = window.confirm(`¿Eliminamos el usuario "${userName}"?`);
    if (confirm) {
      this.usersServices.deleteUser( userID ).subscribe( response => {
        if(response['response']){
          this.getUsers('');
        }
      });
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getUsers('');
  }
}

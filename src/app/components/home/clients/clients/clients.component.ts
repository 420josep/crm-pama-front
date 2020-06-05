import { Component, OnInit } from '@angular/core';
import { ListItem } from 'src/app/templates/global';
import { User } from 'src/app/templates/user';
import { ClientsService } from 'src/app/services/clients.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientListItem } from 'src/app/templates/clients';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalClients: number;
  offset: number = 0;
  clients: ClientListItem[];

  constructor(
    private authService: AuthService, 
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getClients('');
  }

  getClients( text: string){
    this.clientsService.getTotalClients( text ).subscribe( total => {
        this.totalClients = total;
    });

    this.clientsService.getClients( text, this.offset ).subscribe(clients => {
      this.clients = clients;
    });
  }

  deleteClient( clientID: number, clientName: string) {
    let confirm = window.confirm(`¿Eliminamos el cliente "${clientName}"?`);
    if (confirm) {
      this.clientsService.deleteClient(clientID.toString()).subscribe( response => {
        if(response['response']){
          this.getClients('');
        }
      });
    }
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getClients('');
  }

  searchClient(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getClients(this.searchField);
      }
    }else{
      this.getClients('');
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getClients('');
  }
}

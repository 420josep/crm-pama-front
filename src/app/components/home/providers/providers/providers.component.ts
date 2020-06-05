import { Component, OnInit } from '@angular/core';
import { ProviderServices } from 'src/app/services/provider.service';
import { ProviderListItem } from 'src/app/templates/provider';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalProviders: number;
  offset: number = 0;
  providers: ProviderListItem[];

  constructor(
    private authService: AuthService, 
    private providerServices: ProviderServices
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe( user => {
      if(user){
        this.currentUser = user;
        this.getProviders('');
      }
    });
  }

  getProviders( text: string){
    this.providerServices.getTotalProviders( text ).subscribe( total => {
      this.totalProviders = total;
    });

    this.providerServices.getProviders( text, this.offset ).subscribe(categories => {
      this.providers = categories;
    });
  }

  deleteProvider( providerID: number, providerName: string) {
    let confirm = window.confirm(`¿Eliminamos el proveedor "${providerName}"?`);
    if (confirm) {
      this.providerServices.deleteProvider(providerID).subscribe( response => {
        if(response['response']){
          this.getProviders('');
        }
      });
    }
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getProviders('');
  }

  searchProvider(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        console.log(this.searchField)
        this.offset = 0;
        this.getProviders(this.searchField);
      }
    }else{
      this.getProviders('');
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getProviders('');
  }
}

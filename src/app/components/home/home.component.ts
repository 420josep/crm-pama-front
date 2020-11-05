import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  showSales: boolean = false;
  showProducts: boolean = false;
  showClients: boolean = false;
  showProviders: boolean = false;
  showRegister: boolean = false;
  showAdministration: boolean = false;
  companyLogo: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if(user != null){
        this.currentUser = user;
        // TODO pendiente por cambiar a servidor
        this.companyLogo = 'http://localhost/crm_pama_back/' + this.currentUser.companyLogo;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  closeTabs(){
    this.showSales = false;
    this.showProducts = false;
    this.showClients = false;
    this.showProviders = false;
    this.showRegister = false;
    this.showAdministration = false;
  }

}

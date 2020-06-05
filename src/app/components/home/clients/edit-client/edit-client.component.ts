import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ClientsService } from 'src/app/services/clients.service';
import { Client } from 'src/app/templates/clients';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  editClientForm: FormGroup;
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  currentUser: User;
  companies: ListItem[];
  existClient: boolean = true;
  clientID: string;
  currentClient: Client;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companiesService: CompaniesService,
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    this.clientID = this.route.snapshot.paramMap.get("id");

    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.editClientForm = this.formBuilder.group({
      clientID: [this.clientID, [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      discount: ['', [Validators.required],],
      direction: [''],
      phone: [''],
      companyID: ['', [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.editClientForm.addControl('state', new FormControl("", Validators.required));

      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
    this.getClient(this.clientID);
  }

  get form() {
    return this.editClientForm.controls;
  }

  getClient( clientID: string ){
    this.clientsService.getClient(clientID).subscribe( response => {
      if(response){
        this.currentClient = response;
        this.form.firstName.setValue(this.currentClient.firstName);
        this.form.lastName.setValue(this.currentClient.lastName);
        this.form.dni.setValue(this.currentClient.dni);
        this.form.discount.setValue(this.currentClient.discount);
        this.form.direction.setValue(this.currentClient.direction);
        this.form.phone.setValue(this.currentClient.phone);
        if(this.currentUser.type === 1){
          this.form.companyID.setValue(this.currentClient.companyID);
          this.form.state.setValue(this.currentClient.state);
        }
      }else{
        this.existClient = false;
        this.response = false;
        this.message = "El cliente buscado no existe"
      }
    });
  }

  saveClient(){
    if(this.editClientForm.valid){
      this.clientsService.updateClient(this.editClientForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['menu/clientes/lista']);
        }
      });
    }
  }

}

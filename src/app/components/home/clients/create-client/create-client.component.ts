import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  newClientForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  companies: ListItem[];

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private companiesService: CompaniesService,
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newClientForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      dni: ['', [Validators.required, Validators.maxLength(15)]],
      discount: ['', [Validators.required, Validators.maxLength(2)]],
      direction: ['', Validators.maxLength(150)],
      phone: ['', Validators.maxLength(10)],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
      useMobile: [true, [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }

  get form() {
    return this.newClientForm.controls;
  }

  createClient(){
    if(this.newClientForm.valid){
      this.clientsService.createClient(this.newClientForm.value).subscribe( response => {
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

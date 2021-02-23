import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderServices } from 'src/app/services/provider.service';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.css']
})
export class NewProviderComponent implements OnInit {
  currentUser: User;
  newProviderForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  companies: ListItem[];


  constructor( 
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private providerService: ProviderServices,
    private companiesService: CompaniesService  
  ) { 
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newProviderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      nick: ['', Validators.maxLength(150)],
      businessName: ['', [Validators.required, Validators.maxLength(150)]],
      nit: ['', [Validators.required, Validators.maxLength(15)]],
      manager: ['', [Validators.required, Validators.maxLength(80)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      description: ['', Validators.maxLength(150)],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }

  // Método que devuelve los métodos de los campos para validaciones
  get form() {
    return this.newProviderForm.controls;
  }

  /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  saveProvider(){
    this.submitted = true;
    if(this.newProviderForm.valid){
      this.providerService.addProvider(this.newProviderForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['/menu/proveedores/lista']);
        }
      });
    }
  }

}

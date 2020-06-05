import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProviderServices } from 'src/app/services/provider.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Provider } from 'src/app/templates/provider';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.css']
})
export class EditProviderComponent implements OnInit {
  currentUser: User;
  editProviderForm: FormGroup;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentProvider: Provider;
  providerID: string;
  companies: ListItem[];

  
  constructor( 
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private providerServices: ProviderServices,
    private companiesService: CompaniesService
  ) { 
  }

  ngOnInit() {
    //Obtengo el id del proveedor seleccionado desde los parámetros de la URL
    this.providerID = this.route.snapshot.paramMap.get("id");

    this.currentUser = this.authService.getUser;

    this.getProvider(this.providerID);
    
    // Asignación de variables y método de validación
    this.editProviderForm = this.formBuilder.group({
      providerID: ['' , [Validators.required]],
      name: ['' , [Validators.required]],
      nick: [''],
      businessName: ['' , [Validators.required]],
      nit: ['' , [Validators.required]],
      manager: ['' , [Validators.required]],
      phone: ['' , [Validators.required]],
      description: [''],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
    });

    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.editProviderForm.addControl('state', new FormControl("", Validators.required));
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }
  
  // Método que devuelve los métodos de los campos para validaciones
  get form() {
    return this.editProviderForm.controls;
  }

  /**
   * Método que pedirá al servidor los datos del proveedor a editar 
   * y guardará los datos en el objeto proveedor actual y, además
   * asignará los datos extraídos a cada campod el formulario
   * @param providerID ID del proveedor seleccionado/buscado
   */
  getProvider( providerID: string ){
    this.providerServices.getProvider( providerID ).subscribe( (response : Provider) => {
      if(response){
        this.currentProvider = response;
        console.log(this.currentProvider);
        this.form.providerID.setValue(this.currentProvider.id);
        this.form.name.setValue(this.currentProvider.name);
        this.form.nick.setValue(this.currentProvider.nick);
        this.form.businessName.setValue(this.currentProvider.businessName);
        this.form.nit.setValue(this.currentProvider.nit);
        this.form.manager.setValue(this.currentProvider.manager);
        this.form.description.setValue(this.currentProvider.description);
        this.form.phone.setValue(this.currentProvider.phone);
        if(this.currentUser.type === 1){
          this.form.companyID.setValue(this.currentProvider.companyID);
          this.form.state.setValue(this.currentProvider.state);
        }
      }else{
        this.response = false;
        this.message = "El proveedor buscado no existe"
      }
    });
  }

  /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado
   */
  saveProvider(){
    if(this.editProviderForm.valid){
      this.providerServices.updateProvider(this.editProviderForm.value).subscribe( response => {
        console.log(response);
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['/menu/proveedores/lista']);
        }
      });
    }
  }

  /**
   * Método para eliminar el proveedor actualmente editando
   */
  deleteProvider() {
    let confirm = window.confirm(`¿Eliminamos el proveedor "${this.currentProvider.name}"?`);
    if (confirm) {
      this.providerServices.deleteProvider(this.currentProvider.id).subscribe( response => {
        if(response['response']){
          this.router.navigate(['/menu/proveedores/lista']);
        }
      });
    }
  }

}

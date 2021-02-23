import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  user: User;
  userID: string;
  existUser: boolean = true;
  companies: ListItem[];
  branchs: ListItem[];
  userTypes: ListItem[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private usersService: UsersService,
    private authService: AuthService,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private route: ActivatedRoute
  ){ }

  ngOnInit() {
    //Obtengo el id del proveedor seleccionado desde los parámetros de la URL
    this.userID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    this.getUser(this.userID);

    // Asignación de variables y método de validación
    this.editUserForm = this.formBuilder.group({
      userID: [this.userID , Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      companyID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.maxLength(120)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      typeID: ['', [Validators.required]],
      newPassword: ['', [Validators.minLength(6), Validators.maxLength(10)]]
    });

    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      this.branchsService.getBranchItems(this.currentUser.companyID.toString()).subscribe(response => {
        this.branchs = response;
      });
    }else{
      this.editUserForm.addControl('state', new FormControl("", Validators.required));
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }

    this.usersService.getUserTypes().subscribe(response => {
      this.userTypes = response;
    });
  }

  get form() {
    return this.editUserForm.controls;
  }

  getBranchs( companyID: number ): void {
    if( companyID == null || companyID == 0 )
    {
      this.form.branchID.setValue('');
      this.form.branchID.disable();
      return;
    }
    this.form.branchID.enable();
    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
    });
  }

  /**
   * Método que pedirá al servidor los datos del proveedor a editar 
   * y guardará los datos en el objeto proveedor actual y, además
   * asignará los datos extraídos a cada campod el formulario
   * @param providerID ID del proveedor seleccionado/buscado
   */
  getUser( userID: string ){
    this.usersService.getUser(userID).subscribe( response => {
      if(response){
        this.user = response;
        console.log(this.user);
        this.form.userID.setValue(this.user.id);
        this.form.firstName.setValue(this.user.firstName);
        this.form.lastName.setValue(this.user.lastName);
        this.form.companyID.setValue(this.user.companyID);
        this.branchsService.getBranchItems(this.user.companyID.toString()).subscribe(response => {
          this.branchs = response;
        });
        this.form.branchID.setValue(this.user.branchID);
        this.form.dni.setValue(this.user.dni);
        this.form.email.setValue(this.user.email);
        this.form.phone.setValue(this.user.phone);
        this.form.username.setValue(this.user.username);
        if(this.currentUser.type === 1){
          this.form.state.setValue(this.user.state);
        }
        this.form.typeID.setValue(this.user.type);
      }else{
        this.existUser = false;
        this.response = false;
        this.message = "El usuario buscado no existe"
      }
    });
  }

  /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado
   */
  saveUser(){
    if(this.editUserForm.valid){
      
      this.usersService.updateUser(this.editUserForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['/menu/usuarios/lista']);
        }
      });
    }
  }
}

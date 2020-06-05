import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { BranchOfficeService } from 'src/app/services/branch-office.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  newUserForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  companies: ListItem[];
  branchs: ListItem[];
  userTypes: ListItem[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private usersService: UsersService,
    private authService: AuthService,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService
  ){ }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      DNI: ['', [Validators.required]],
      email: [''],
      phone: ['', [Validators.required]],
      username: ['', [Validators.required]],
      typeID: ['', [Validators.required]],
    });

    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      this.branchsService.getBranchItems(this.currentUser.companyID.toString()).subscribe(response => {
        this.branchs = response;
      });
    }else{
      this.form.branchID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }

    this.usersService.getUserTypes().subscribe(response => {
      this.userTypes = response;
    });
  }

  get form() {
    return this.newUserForm.controls;
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
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  saveUser(){
    this.submitted = true;
    if(this.newUserForm.valid){
      this.usersService.addUser(this.newUserForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/usuarios/lista']);
        }
      });
    }
  }

}

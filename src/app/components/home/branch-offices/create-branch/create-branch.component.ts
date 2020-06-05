import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css']
})
export class CreateBranchComponent implements OnInit {
  newBranchForm: FormGroup;
  submitted: boolean = false;
  countries: ListItem[];
  provinces: ListItem[];
  cities: ListItem[];
  companies: ListItem[];
  currentUser: User;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private companiesService: CompaniesService,
    private tools: ToolsService,
    private authService: AuthService,
    private branchsService: BranchOfficeService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      countryID: ['', [Validators.required]],
      provinceID: ['', [Validators.required]],
      cityID: ['', [Validators.required]],
      creationUser: [ this.currentUser.id, [Validators.required]],
    });

    this.tools.getCountries().subscribe(response => {
        this.countries = response;
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
    return this.newBranchForm.controls;
  }

  getProvinces( countryID: number ): void {
    if( countryID == null || countryID == 0 )
    {
      this.form.provinceID.setValue('');
      this.form.provinceID.disable();
      this.form.cityID.setValue('');
      this.form.cityID.disable();
      return;
    }
    this.form.provinceID.enable();
    this.tools.getProvinces( countryID.toString() ).subscribe( response => {
      this.provinces = response;
    });
  }

  getCities( provinceID: number ): void {
    if( provinceID == null || provinceID == 0 )
    {
      this.form.cityID.setValue('');
      this.form.cityID.disable();
      return;
    }
    this.form.cityID.enable();
    this.tools.getCities( provinceID.toString() ).subscribe( response  => {
      this.cities = response;
    });
  }

  /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  saveBranch(){
    this.submitted = true;
    if(this.newBranchForm.valid){
      this.branchsService.createBranchOffice(this.newBranchForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/sucursales/lista']);
        }
      });
    }
  }

}

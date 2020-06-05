import { Component, OnInit } from '@angular/core';
import { BranchOffice } from 'src/app/templates/company';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { ListItem } from 'src/app/templates/global';
import { ToolsService } from 'src/app/services/tools.service';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.css']
})
export class EditBranchComponent implements OnInit {
  editBranchForm: FormGroup;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentBranch: BranchOffice;
  branchID: string;
  existBranch: boolean = true;
  countries: ListItem[];
  provinces: ListItem[];
  cities: ListItem[];
  companies: ListItem[];
  submitted: boolean = false;
  currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private branchsServices: BranchOfficeService,
    private tools: ToolsService,
    private authService: AuthService,
    private companiesService: CompaniesService ) { 
  }

  ngOnInit() {
    //Obtengo el id del proveedor seleccionado desde los parámetros de la URL
    this.branchID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.editBranchForm = this.formBuilder.group({
      branchID: [this.branchID, [Validators.required]],
      name: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      countryID: ['', [Validators.required]],
      provinceID: ['', [Validators.required]],
      cityID: ['', [Validators.required]],
    });

    this.form.provinceID.disable();
    this.form.cityID.disable();

    this.tools.getCountries().subscribe(response => {
        this.countries = response;
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.editBranchForm.addControl('state', new FormControl("", Validators.required));
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }

    this.getBranch(this.branchID);

  }

  getBranch( branchID: string ){
    this.branchsServices.getBranch(branchID).subscribe( response => {
      if(response){
        this.currentBranch = response;
        console.log(this.currentBranch);
        this.form.name.setValue(this.currentBranch.name);
        this.form.companyID.setValue(this.currentBranch.companyID);
        this.form.countryID.setValue(this.currentBranch.countryID);
        this.getProvinces(this.currentBranch.countryID);
        this.form.provinceID.setValue(this.currentBranch.provinceID);
        this.form.provinceID.enable();
        this.getCities(this.currentBranch.provinceID);
        this.form.cityID.setValue(this.currentBranch.cityID);
        this.form.cityID.enable();
        if(this.currentUser.type === 1){
          this.form.state.setValue(this.currentBranch.state);
        }
      }else{
        this.existBranch = false;
        this.response = false;
        this.message = "La sucursal buscada no existe"
      }
    });
  }

  // Método que devuelve los métodos de los campos para validaciones
  get form() {
    return this.editBranchForm.controls;
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
    this.form.cityID.setValue('');
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
    if(this.editBranchForm.valid){
      this.branchsServices.updateBranch(this.editBranchForm.value).subscribe( response => {
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

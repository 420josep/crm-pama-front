import { Component, OnInit } from '@angular/core';
import { Company, PricingItem } from 'src/app/templates/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  form: FormGroup;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentCompany: Company;
  companyID: string;
  existCompany: boolean = true;
  currentUser: User;
  pricingItems: PricingItem[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companiesService: CompaniesService
  ) { 
  }

  ngOnInit() {
    //Obtengo el id del proveedor seleccionado desde los parámetros de la URL
    this.companyID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    this.getCompany(this.companyID);

    // Asignación de variables y método de validación
    this.form = this.formBuilder.group({
      companyID: ['', [Validators.required]],
      name: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      pricingID: ['', [Validators.required]],
      state: ['', [Validators.required]]
    });

    this.companiesService.getPricing().subscribe(response => {
      if(response){
        this.pricingItems = response;
      }else{
        this.pricingItems = [];
      }
    });
  }

  getCompany( companyID: string ){
    this.companiesService.getCompany(companyID).subscribe( response => {
      if(response){
        this.currentCompany = response;
        console.log(this.currentCompany);
        this.form.controls.companyID.setValue(this.currentCompany.id);
        this.form.controls.name.setValue(this.currentCompany.name);
        this.form.controls.manager.setValue(this.currentCompany.manager);
        this.form.controls.contact.setValue(this.currentCompany.contact);
        this.form.controls.pricingID.setValue(this.currentCompany.pricingID);
        this.form.controls.state.setValue(this.currentCompany.state);
      }else{
        this.existCompany = false;
        this.response = false;
        this.message = "La empresa buscada no existe"
      }
    });
  }

  saveCompany(){
    if(this.form.valid){
      this.companiesService.updateCompany(this.form.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['/menu/empresas/lista']);
        }
      });
    }
  }  
}

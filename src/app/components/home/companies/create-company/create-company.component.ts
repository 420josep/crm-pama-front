import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { PricingItem } from 'src/app/templates/company';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  newCompanyForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  pricingItems: PricingItem[];

  constructor(private formBuilder: FormBuilder, private router: Router, private companiesService: CompaniesService) { }

  ngOnInit() {
    // Asignación de variables y método de validación
    this.newCompanyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      pricingId: ['', [Validators.required]]
    });

    this.companiesService.getPricing().subscribe(response => {
      if(response){
        this.pricingItems = response;
      }else{
        this.pricingItems = [];
      }
    });

  }

    /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  saveCompany(){
    this.submitted = true;
    if(this.newCompanyForm.valid){
      this.companiesService.createCompany(this.newCompanyForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/empresas/lista']);
        }
      });
    }
  }

}

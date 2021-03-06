import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { ProductsService } from 'src/app/services/products.service';
import { PresentationType } from 'src/app/templates/products';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  newProductForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  companies: ListItem[];
  categories: ListItem[];
  subcategories: ListItem[];
  presentationTypes: PresentationType[];


  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private companiesService: CompaniesService,
    private productsService: ProductsService
  ) { 
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      brand: ['', [Validators.required, Validators.maxLength(150)]],
      presentationID: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.maxLength(45)]],
      price: ['', [Validators.required, Validators.maxLength(13)]],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
      iva: [true, [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
    this.productsService.getPresentationTypes().subscribe( presentationTypes => {
      this.presentationTypes = presentationTypes;
    });
  }

  get form() {
    return this.newProductForm.controls;
  }

  /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  createProduct(){
    if(this.newProductForm.valid){
      this.productsService.createProduct(this.newProductForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['menu/productos/lista']);
        }
      });
    }
  }
}

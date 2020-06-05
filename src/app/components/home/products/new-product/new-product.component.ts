import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { CategoryService } from 'src/app/services/category.service';
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
    private categoriesService: CategoryService,
    private productsService: ProductsService
  ) { 
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.newProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      presentationID: ['', [Validators.required]],
      content: ['', [Validators.required]],
      price: ['', [Validators.required]],
      categoryID: ['', [Validators.required]],
      subcategoryID: ['', [Validators.required]],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      this.getCategories(this.currentUser.companyID);
    }else{
      this.form.categoryID.disable();
      this.form.subcategoryID.disable();
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

  getCategories( companyID: number ){
    if( companyID == null || companyID == 0 )
    {
      this.form.categoryID.setValue('');
      this.form.categoryID.disable();
      this.form.subcategoryID.setValue('');
      this.form.subcategoryID.disable();
      return;
    }
    this.categoriesService.getCategoriesList(companyID).subscribe( categories => {
      this.categories = categories;
      this.form.categoryID.enable();
    });
  }

  getSubcategories( categoryID: number ){
    if( categoryID == null || categoryID == 0 )
    {
      this.form.subcategoryID.setValue('');
      this.form.subcategoryID.disable();
      return;
    }
    this.categoriesService.getSubcategories(categoryID).subscribe( subcategories => {
      this.subcategories = subcategories;
      this.form.subcategoryID.enable();
    });
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

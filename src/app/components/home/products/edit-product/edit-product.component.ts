import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { CategoryService } from 'src/app/services/category.service';
import { ProductsService } from 'src/app/services/products.service';
import { PresentationType, Product } from 'src/app/templates/products';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
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
  existProduct: boolean = true;
  productID: string;
  currentProduct: Product;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companiesService: CompaniesService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.paramMap.get("id");

    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.editProductForm = this.formBuilder.group({
      productID: [this.productID, [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(150)]],
      brand: ['', [Validators.required, Validators.maxLength(150)]],
      presentationID: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.maxLength(45)]],
      price: ['', [Validators.required, Validators.maxLength(13)]],
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
      iva: ['', [Validators.required]],
    });
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
    }else{
      this.editProductForm.addControl('state', new FormControl("", Validators.required));

      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
    this.productsService.getPresentationTypes().subscribe( presentationTypes => {
      this.presentationTypes = presentationTypes;
    });
    this.getProduct(this.productID);
  }

  getProduct( productID: string ){
    this.productsService.getProduct(productID).subscribe( response => {
      if(response){
        this.currentProduct = response;
        this.form.name.setValue(this.currentProduct.name);
        this.form.brand.setValue(this.currentProduct.brand);
        this.form.presentationID.setValue(this.currentProduct.presentationID);
        this.form.content.setValue(this.currentProduct.content);
        this.form.price.setValue(this.currentProduct.price);
        this.form.iva.setValue(this.currentProduct.iva);
        if(this.currentUser.type === 1){
          this.form.companyID.setValue(this.currentProduct.companyID);
          this.form.state.setValue(this.currentProduct.state);
        }
      }else{
        this.existProduct = false;
        this.response = false;
        this.message = "El producto buscado no existe"
      }
    });
  }

  get form() {
    return this.editProductForm.controls;
  }

  saveProduct(){
    if(this.editProductForm.valid){
      this.productsService.updateProduct(this.editProductForm.value).subscribe( response => {
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { ProductsService } from 'src/app/services/products.service';
import { ProviderServices } from 'src/app/services/provider.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { EntriesService } from 'src/app/services/entries.service';
import { ProductSaleList } from 'src/app/templates/sale';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.css']
})
export class CreateEntryComponent implements OnInit {
  newEntryForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  providers: ListItem[];
  products: ProductSaleList[];
  companies: ListItem[];
  branchs: ListItem[];
  currentDate: Date;
  total: number;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private productsService: ProductsService,
    private providersService: ProviderServices,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private entriesService: EntriesService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    let today =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    
    // Asignación de variables y método de validación
    this.newEntryForm = this.formBuilder.group({
      date: [today, [Validators.required]],
      billNumber: ['', [Validators.required]],
      providerID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      products: this.formBuilder.array([]),
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
      total: ['', [Validators.required]],
    });
    
    this.addProduct();

    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      if(this.currentUser.type === 3){
        this.form.branchID.setValue(this.currentUser.branchID);
      }
      this.getData(this.currentUser.companyID);
    }else{
      this.form.branchID.disable();
      this.form.providerID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }

  get form() {
    return this.newEntryForm.controls;
  }

  get productContainer(): FormArray {
    return <FormArray>this.newEntryForm.get('products')
  }

  addProduct() {
    (this.productContainer).push(this.addProductFormGroup());
    if (this.products) {
      if (this.products.length > 0) {
        this.enableProducts();
      }
    }
  }

  getData( companyID: number ) {
    if( companyID == null || companyID == 0 )
    {
      this.form.providerID.setValue('');
      this.form.providerID.disable();
      this.newEntryForm.controls.products = this.formBuilder.array([]);
      this.addProduct();
      if (this.currentUser.type != 3) {
        this.form.branchID.setValue('');
        this.form.branchID.disable();
      }
      return;
    }
    if (this.currentUser.type != 3) {
      this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
        this.branchs = response;
        this.form.branchID.setValue('');
        this.form.branchID.enable();
      });
    }
    this.providersService.getProvidersList(companyID).subscribe(response => {
      this.providers = response;
      this.form.providerID.setValue('');
      this.form.providerID.enable();
    });
    this.productsService.getProductsList(companyID, 1).subscribe(response => {
      this.products = response;
      if (this.products) {
        if (this.products.length > 0) {
          this.enableProducts();
        }
      }
    });
    this.newEntryForm.controls.products = this.formBuilder.array([]);
    this.addProduct();
  }

  removeProduct(index: number) {
    if (this.productContainer.length > 1) {
      this.productContainer.removeAt(index);
    }
  }

  addProductFormGroup() {
    return this.formBuilder.group({
      id: [{value:'', disabled: true}, Validators.required],
      unitValue: ['', Validators.required],
      quantity: [1, Validators.required]
    });
  }

  enableProducts(){
    for (let index = 0; index < this.productContainer.length; index++) {
      this.productContainer.controls[index].get('id').enable();         
    }
  }

  updateTotal() {
    this.total = 0;
    for (let index = 0; index < this.productContainer.length; index++) {
      const product = this.productContainer.controls[index].value;
      const quantity = this.productContainer.controls[index].value.quantity;
      if (product && (quantity > 0)) {
        this.total += product.unitValue * quantity;
      }
    }
    this.form.total.setValue(this.total);
  }

  /**
   * Método para validar que no se añada 2 veces el mismo producto
   */
  checkSameProducts() {
    if(this.productContainer.length > 1){
      for (let index = 0; index < this.productContainer.length; index++) {
        for (let secondIndex = 0; secondIndex < this.productContainer.length; secondIndex++) {
          let x = this.productContainer.controls[index].get('id').value;
          let y = this.productContainer.controls[secondIndex].get('id').value;
          if (x && y) {
            if (index != secondIndex) {
              if (x === y) {
                this.productContainer.controls[secondIndex].get('id').setValue(null);
                this.updateTotal();
                this.response = false;
                this.message = "No puedes añadir 2 veces el mismo producto";
                setTimeout(() => {
                  this.response = true;
                  this.message = '';
                }, 3000);
                return;
              }
            }
          }
        }
      }
    }
    this.updateTotal();
  }

  updateQuantity( position:number, option: number) {
    if (this.productContainer.controls[position].value.id) {
      if (option === 1 && this.productContainer.controls[position].value.quantity >= 2) {
        this.productContainer.controls[position].get('quantity').setValue(this.productContainer.controls[position].value.quantity - 1);
        this.updateTotal();
      } 
      if (option === 2) {
        this.productContainer.controls[position].get('quantity').setValue(this.productContainer.controls[position].value.quantity + 1);
        this.updateTotal();
      }
    }
  }

  createEntry(){
    if(this.newEntryForm.valid){
      this.entriesService.createEntry(this.newEntryForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['menu/entradas/lista']);
        }
      });
    }
  }

}

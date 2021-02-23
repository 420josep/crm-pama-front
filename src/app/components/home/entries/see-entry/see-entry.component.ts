import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/app/services/entries.service';
import { Entry } from 'src/app/templates/entries';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ListItem } from 'src/app/templates/global';
import { ProductSaleList } from 'src/app/templates/sale';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ProductsService } from 'src/app/services/products.service';
import { ProviderServices } from 'src/app/services/provider.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-see-entry',
  templateUrl: './see-entry.component.html',
  styleUrls: ['./see-entry.component.css']
})
export class SeeEntryComponent implements OnInit {
  currentEntry: Entry;
  existEntry: boolean = true;
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  entryID: string;
  currentUser: User;
  editEntryForm: FormGroup;
  providers: ListItem[];
  products: ProductSaleList[];
  companies: ListItem[];
  branchs: ListItem[];
  total: number;

  constructor(
    private route: ActivatedRoute,
    private entriesService: EntriesService,
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private productsService: ProductsService,
    private providersService: ProviderServices,
    private branchsService: BranchOfficeService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    this.editEntryForm = this.formBuilder.group({
      entryID: [this.entryID, [Validators.required]],
      date: ['', [Validators.required]],
      billNumber: ['', [Validators.required, Validators.maxLength(13)]],
      providerID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      products: this.formBuilder.array([]),
      total: ['', [Validators.required]],
    });
    this.getEntry();
  }

  getEntry(){
    this.entriesService.getEntry(this.entryID).subscribe( response => {
      if(response){
        this.currentEntry = response;
        let date =  this.datePipe.transform(this.currentEntry.date, 'yyyy-MM-dd');
        if(this.currentUser.type === 3){
          this.form.branchID.setValue(this.currentUser.branchID);
          this.getData(this.currentUser.companyID);
        } else if(this.currentUser.type === 2){
          this.form.branchID.setValue(this.currentEntry.branchID);
          this.getData(this.currentUser.companyID);
        } else {
          this.form.branchID.setValue(this.currentEntry.branchID);
          this.getData(this.currentEntry.companyID);
        }
        this.form.date.setValue(date);
        this.form.billNumber.setValue(this.currentEntry.billNumber);
        this.form.providerID.setValue(this.currentEntry.providerID);
        this.form.total.setValue(this.currentEntry.total);
        this.total = this.currentEntry.total;

      }else{
        this.existEntry = false;
        this.response = false;
        this.message = "La entrada buscada no existe";
      }
    });
  }

  get form() {
    return this.editEntryForm.controls;
  }

  get productContainer(): FormArray {
    return <FormArray>this.editEntryForm.get('products')
  }

  addProduct() {
    (this.productContainer).push(this.addProductFormGroup());
  }

  getData( companyID: number ) {
    if( companyID == null || companyID == 0 )
    {
      this.form.providerID.setValue('');
      this.form.providerID.disable();
      this.editEntryForm.controls.products = this.formBuilder.array([]);
      if (this.currentUser.type != 3) {
        this.form.branchID.setValue('');
        this.form.branchID.disable();
      }
      return;
    }
    if (this.currentUser.type != 3) {
      this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
        this.branchs = response;
      });
    }
    this.providersService.getProvidersList(companyID).subscribe(response => {
      this.providers = response;
      console.log(this.providers);
    });
    
    this.productsService.getProductsList(companyID, 1).subscribe(response => {
      this.products = response;
      if (this.products) {
        if (this.products.length > 0) {
          for (let index = 0; index < this.currentEntry.products.length; index++) {
            for (let secondIndex = 0; secondIndex < this.products.length; secondIndex++) {
              if (this.currentEntry.products[index].productID === this.products[secondIndex].id) {
                this.addProduct();
                this.productContainer.controls[index].get('id').setValue(this.currentEntry.products[index].id);
                this.productContainer.controls[index].get('productID').setValue(this.currentEntry.products[index].productID);
                this.productContainer.controls[index].get('unitValue').setValue(this.currentEntry.products[index].unitValue);
                this.productContainer.controls[index].get('quantity').setValue(this.currentEntry.products[index].quantity);
                break;
              }
            }
          }
        }
      }
    });
  }

  removeProduct(index: number) {
    if (+this.productContainer.controls[index].get('id').value > 0) {
      this.deleteSaleProduct(this.productContainer.controls[index].get('id').value);
    }
    this.productContainer.removeAt(index);
    this.updateTotal();
  }

  deleteSaleProduct( productID: number ) {
    let productName = "";
    for (let index = 0; index < this.products.length; index++) {
      if( this.products[index].id === productID ){
        productName = this.products[index].name;
        break;
      }
    }
    let confirm = window.confirm(`¿Seguro que desea eliminar el producto "${productName}" de la entrada "${this.currentEntry.billNumber}"? (Esta opción no se puede deshacer)`);
    if (confirm) {
      this.entriesService.deleteSaleProduct(productID).subscribe(response => {
        this.response = response['response'];
        if (this.response) {
          this.editEntryForm.controls.products = this.formBuilder.array([]);
          this.getEntry();
        } else {
          this.message = response['message'];
        }
      })
    }
  }

  addProductFormGroup() {
    return this.formBuilder.group({
      id: [''],
      productID: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.maxLength(13)]],
      quantity: [1, [Validators.required, Validators.maxLength(7)]]
    });
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
          let x = this.productContainer.controls[index].get('productID').value;
          let y = this.productContainer.controls[secondIndex].get('productID').value;
          if (x && y) {
            if (index != secondIndex) {
              if (x === y) {
                this.productContainer.controls[secondIndex].get('productID').setValue(null);
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
    if (this.productContainer.controls[position].get('productID').value) {
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

  updateEntry(){
    if(this.editEntryForm.valid){
      this.entriesService.updateEntry(this.editEntryForm.value).subscribe( response => {
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

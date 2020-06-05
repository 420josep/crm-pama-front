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
import { ToolsService } from 'src/app/services/tools.service';
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

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private productsService: ProductsService,
    private providersService: ProviderServices,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private tools: ToolsService,
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

  getData( companyID: number ) {
    if( companyID == null || companyID == 0 )
    {
      this.form.providerID.setValue('');
      this.form.providerID.disable();
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
    });
  }

  get productContainer(): FormArray {
    return <FormArray>this.newEntryForm.get('products')
  }

  addProduct() {
    (this.productContainer).push(this.addProductFormGroup());
  }

  removeProduct(index: number) {
    if (this.productContainer.length > 1) {
      this.productContainer.removeAt(index);
    }
  }

  addProductFormGroup() {
    return this.formBuilder.group({
      id: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  createProduct(){
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

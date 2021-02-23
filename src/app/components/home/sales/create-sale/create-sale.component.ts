import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { SalesService } from 'src/app/services/sales.service';
import { ProductSaleList } from 'src/app/templates/sale';
import { ClientsService } from 'src/app/services/clients.service';
import { DatePipe } from '@angular/common';
import { ClientsList } from 'src/app/templates/clients';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {
  newSaleForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentUser: User;
  clients: ListItem[];
  products: ProductSaleList[];
  companies: ListItem[];
  branchs: ListItem[];
  paymentMethods: ListItem[];
  saleStatus: ListItem[];
  total: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  ivaValue: number = 0;
  discountValue: number = 0;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private salesService: SalesService,
    private clientsService: ClientsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    let today =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    
    // Asignación de variables y método de validación
    this.newSaleForm = this.formBuilder.group({
      date: [today, [Validators.required]],
      client: ['', [Validators.required]],
      clientID: ['', [Validators.required]],
      billNumber: ['', [Validators.required, Validators.maxLength(13)]],
      branchID: ['', [Validators.required]],
      total: ['', [Validators.required]],
      realTotal: ['', [Validators.required]],
      statusID: ['', [Validators.required]],
      paymentID: ['', [Validators.required]],
      observation: ['', Validators.maxLength(100)],
      products: this.formBuilder.array([]),
      userID: [this.currentUser.id, [Validators.required]],
      companyID: ['', [Validators.required]],
      discountValue: ['', [Validators.required]],
      ivaValue: ['', [Validators.required]],
      paySome: [false, [Validators.required]],
    });
    
    this.addProduct();

    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      this.getData(this.currentUser.companyID);
    }else{
      this.form.client.setValue('');
      this.form.client.disable();
      this.form.branchID.setValue('');
      this.form.branchID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }

    this.salesService.getSaleStatus().subscribe( response => {
      this.saleStatus = response;
    });
    this.salesService.getPaymentMethods().subscribe( response => {
      this.paymentMethods = response;
    });
  }

  get form() {
    return this.newSaleForm.controls;
  }

  getData( companyID: number ) {
    if( companyID == null || companyID == 0 )
    {
      this.form.clientID.setValue('');
      this.form.client.setValue('');
      this.form.client.disable();
      this.form.branchID.setValue('');
      this.form.branchID.disable();
      return;
    }
    this.form.clientID.setValue('');
    this.form.client.setValue('');
    this.form.client.enable();

    if (this.currentUser.type != 3) {
      this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
        this.branchs = response;
        this.form.branchID.setValue('');
        this.form.branchID.enable();
      });
    } else {
      this.form.branchID.setValue(this.currentUser.branchID);
      this.getLastBill(this.currentUser.branchID);
      this.getProducts(this.currentUser.branchID);
    }

    this.clientsService.getClientsList(companyID).subscribe( response => {
      this.clients = response;
    });

    this.newSaleForm.controls.products = this.formBuilder.array([]);
    this.addProduct();
    this.updateTotal();
  }

  getBranchData(branchID: number) {
    this.getLastBill(branchID);
    this.getProducts(branchID);
  }

  getLastBill( branchID: number ) {
    this.branchsService.getLastBillNumber(branchID).subscribe( response => {
      this.form.billNumber.setValue(response);
    });
  }

  selectDiscount(client: ClientsList) {
    this.form.clientID.setValue(client.id);
    this.discount = client.discount;
    this.updateTotal();
  }

  getProducts(branchID: number){
    if( branchID == null || branchID == 0 )
    {
      this.products = [];
      this.newSaleForm.controls.products = this.formBuilder.array([]);
      this.addProduct();
      this.updateTotal();
    } else {
      this.salesService.getProductsStock(branchID).subscribe(response => {
        this.products = response;
        if (this.products.length > 0) {
          this.enableProducts();
        } else {
          this.newSaleForm.controls.products = this.formBuilder.array([]);
          this.addProduct();
          this.updateTotal();
        }
      });
    }
  };

  get productContainer(): FormArray {
    return <FormArray>this.newSaleForm.get('products');
  }

  showParcialPayment() {
    if (this.form.statusID.value == 2) {
      if (this.form.paySome.value) {
        this.newSaleForm.addControl('parcialPayment', new FormControl("", [Validators.required,Validators.maxLength(13)]));
      } else {
        this.newSaleForm.removeControl('parcialPayment');
      }
    } else {
      this.form.paySome.setValue(false);
      this.newSaleForm.removeControl('parcialPayment');
    }
  }

  addProduct() {
    (this.productContainer).push(this.addProductFormGroup());
    if (this.products) {
      if (this.products.length > 0) {
        this.enableProducts();
      }
    }
  }

  enableProducts(){
    for (let index = 0; index < this.productContainer.length; index++) {
      this.productContainer.controls[index].get('product').enable();         
    }
  }

  removeProduct(index: number) {
    if (this.productContainer.length > 1) {
      this.productContainer.removeAt(index);
    }
    this.updateTotal();
  }

  addProductFormGroup() {
    return this.formBuilder.group({
      product: [{value:'', disabled: true}, Validators.required],
      quantity: [1, [Validators.required, Validators.maxLength(7)]]
    });
  }

  updateTotal() {
    this.total = 0;
    this.subtotal = 0;
    this.ivaValue = 0;
    this.discountValue = 0;

    for (let index = 0; index < this.productContainer.length; index++) {
      const product = this.productContainer.controls[index].value.product;
      const quantity = this.productContainer.controls[index].value.quantity;
      if (product && (quantity > 0)) {
        this.subtotal += product.price * quantity;
        // Se calcula el iva de cada producto junto con sus cantidades
        if (product.iva) {
          this.ivaValue += (product.price * quantity) - Math.floor((product.price * quantity)/1.19);
        }
      }
    }
    if(this.subtotal > 0) {
      this.total = this.subtotal;
      if (this.discount > 0) {
        let realDiscount = (100 - this.discount)/100;
        this.total = Math.floor(this.total * realDiscount);
      }
      this.discountValue = this.subtotal - this.total;

      this.form.total.setValue(this.total);
      this.form.realTotal.setValue(this.subtotal);
      this.form.discountValue.setValue(this.discountValue);
      this.form.ivaValue.setValue(this.ivaValue);
    } else {
      this.form.total.setValue('');
      this.form.realTotal.setValue('');
      this.form.discountValue.setValue('');
      this.form.ivaValue.setValue('');
    }
  }

  /**
   * Método para validar que no se añada 2 veces el mismo producto
   */
  checkSameProducts() {
    if(this.productContainer.length > 1){
      for (let index = 0; index < this.productContainer.length; index++) {
        for (let secondIndex = 0; secondIndex < this.productContainer.length; secondIndex++) {
          let x = this.productContainer.controls[index].get('product').value;
          let y = this.productContainer.controls[secondIndex].get('product').value;
          if (x && y) {
            if (index != secondIndex) {
              if (x.id === y.id) {
                this.productContainer.controls[secondIndex].get('product').setValue(null);
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
    if (this.productContainer.controls[position].value.product) {
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

  checkValues():boolean {
    for (let index = 0; index < this.productContainer.length; index++) {
      const product = this.productContainer.controls[index].value.product;
      const quantity = this.productContainer.controls[index].value.quantity;
      if ((quantity > product.stock) || (quantity <= 0)) {
        return;
      }
    }
    return true;
  }

  createSale(){
    if(this.newSaleForm.valid){
      if (this.checkValues()) {
        this.salesService.createSale(this.newSaleForm.value).subscribe( response => {
          this.response = response['response'];
          if(!this.response){
            this.message = response ['message']
          }else{
            this.router.navigate(['menu/ventas/lista']);
          }
        });
      } else {
        this.response = false;
        this.message = "Debe seleccionar una cantidad de las disponibles para cada producto";
        setTimeout(() => {
          this.response = true;
          this.message = '';
        }, 5000);
      }
    }
  }


}

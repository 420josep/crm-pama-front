import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { ListItem } from 'src/app/templates/global';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { SalesService } from 'src/app/services/sales.service';
import { ProductSaleList, Sale, EditProductSale } from 'src/app/templates/sale';
import { ClientsService } from 'src/app/services/clients.service';
import { DatePipe } from '@angular/common';
import { ClientsList } from 'src/app/templates/clients';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent implements OnInit {
  editSaleForm: FormGroup;
  existSale: boolean = true;
  saleID: string;
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  currentUser: User;
  clients: ClientsList[];
  products: ProductSaleList[];
  companies: ListItem[];
  branchs: ListItem[];
  paymentMethods: ListItem[];
  saleStatus: ListItem[];
  total: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  currentSale: Sale;
  ivaValue: number = 0;
  discountValue: number = 0;
  totalPartialPayments: number = 0;
  pendingToPay: number = 0;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private branchsService: BranchOfficeService,
    private salesService: SalesService,
    private clientsService: ClientsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.paramMap.get("id");

    this.currentUser = this.authService.getUser;
    
    // Asignación de variables y método de validación
    this.editSaleForm = this.formBuilder.group({
      saleID: [this.saleID, [Validators.required]],
      date: ['', [Validators.required]],
      client: ['', [Validators.required]],
      clientID: ['', [Validators.required]],
      billNumber: ['', [Validators.required, Validators.maxLength(13)]],
      branchID: ['', [Validators.required]],
      total: ['', [Validators.required]],
      realTotal: ['', [Validators.required]],
      statusID: ['', [Validators.required]],
      paymentID: ['', [Validators.required]],
      observation: ['', Validators.maxLength(100)],
      discountValue: ['', [Validators.required]],
      ivaValue: ['', [Validators.required]],
      products: this.formBuilder.array([]),
    });
    this.salesService.getSaleStatus().subscribe( response => {
      this.saleStatus = response;
    });
    this.salesService.getPaymentMethods().subscribe( response => {
      this.paymentMethods = response;
    });

    this.getSale(this.saleID);
  }

  get form() {
    return this.editSaleForm.controls;
  }

  getSale( saleID: string ){
    this.salesService.getSale(saleID).subscribe( response => {
      if(response){
        console.log(response);
        this.editSaleForm.controls.products = this.formBuilder.array([]);

        this.currentSale = response;
        let date =  this.datePipe.transform(this.currentSale.date, 'yyyy-MM-dd');

        if(this.currentUser.type === 3){
          this.form.branchID.setValue(this.currentUser.branchID);
          this.getData(this.currentUser.companyID);
          this.getProducts(this.currentUser.branchID);
        } else if(this.currentUser.type === 2){
          this.form.branchID.setValue(this.currentSale.branchID);
          this.getData(this.currentUser.companyID);
          this.getProducts(this.currentSale.branchID);
        } else {
          this.form.branchID.setValue(this.currentSale.branchID);
          this.getData(this.currentSale.companyID);
          this.getProducts(this.currentSale.branchID);
        }
        this.form.date.setValue(date);
        this.form.clientID.setValue(this.currentSale.clientID);
        this.form.billNumber.setValue(this.currentSale.billNumber);
        this.form.total.setValue(this.currentSale.total);
        this.form.realTotal.setValue(this.currentSale.realTotal);
        this.form.statusID.setValue(this.currentSale.statusID);
        this.form.paymentID.setValue(this.currentSale.paymentID);
        this.form.observation.setValue(this.currentSale.observation);
        this.form.discountValue.setValue(this.currentSale.discountValue);
        this.form.ivaValue.setValue(this.currentSale.ivaValue);
        this.discountValue = this.currentSale.discountValue;
        this.ivaValue = this.currentSale.ivaValue;
        this.subtotal = this.currentSale.realTotal;
        this.total = this.currentSale.total;
        if (this.currentSale.partialPayments.length > 0) {
          this.totalPartialPayments = 0;
          this.pendingToPay = 0;
          for (let index = 0; index < this.currentSale.partialPayments.length; index++) {
            this.totalPartialPayments += this.currentSale.partialPayments[index].value;
          }
          this.pendingToPay = this.total - this.totalPartialPayments;
        } else {
          this.totalPartialPayments = 0;
          this.pendingToPay = 0;
        }
      }else{
        this.totalPartialPayments = 0;
        this.existSale = false;
        this.response = false;
        this.message = "La venta buscada no existe"
      }
    });
  }

  getData( companyID: number ) {
    if (this.currentUser.type != 3) {
      this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
        this.branchs = response;
      });
    }

    this.clientsService.getClientsList(companyID).subscribe( response => {
      this.clients = response;
      if (this.clients) {
        for (let index = 0; index < this.clients.length; index++) {
          if (this.form.clientID.value === this.clients[index].id ) {
            this.form.client.setValue(this.clients[index]);
            this.discount = this.clients[index].discount;
            break;
          }
        }
      }
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
      this.editSaleForm.controls.products = this.formBuilder.array([]);
      this.updateTotal();
    } else {
      this.salesService.getProductsStock(branchID).subscribe(response => {
        this.products = response;
        if (this.products.length > 0) {
          for (let index = 0; index < this.currentSale.products.length; index++) {
            for (let secondIndex = 0; secondIndex < this.products.length; secondIndex++) {
              if (this.currentSale.products[index].productID === this.products[secondIndex].id) {
                this.addProduct();
                this.products[secondIndex]['id'] = this.currentSale.products[index].id;
                this.products[secondIndex]['productID'] = this.currentSale.products[index].productID;
                this.productContainer.controls[index].get('product').setValue(this.products[secondIndex]);
                this.productContainer.controls[index].get('quantity').setValue(this.currentSale.products[index].quantity);
                break;
              }
            }
          }
          this.enableProducts(1);
        } else {
          this.editSaleForm.controls.products = this.formBuilder.array([]);
          this.updateTotal();
        }
      });
    }
  };

  get productContainer(): FormArray {
    return <FormArray>this.editSaleForm.get('products');
  }

  addProduct() {
    (this.productContainer).push(this.addProductFormGroup());
    if (this.products) {
      if (this.products.length === 0) {
        this.enableProducts(2);
      }
    }
  }

  enableProducts(option: number){
    if (option === 1) {
      for (let index = 0; index < this.productContainer.length; index++) {
        this.productContainer.controls[index].get('product').enable();         
      }
    } else{
      for (let index = 0; index < this.productContainer.length; index++) {
        this.productContainer.controls[index].get('product').disable();         
      }
    }

  }

  addProductFormGroup() {
    return this.formBuilder.group({
      product: ['', Validators.required],
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

  removeProduct(index: number) {
    if (this.productContainer.controls[index].get('product').value.productID) {
      this.deleteSaleProduct(this.productContainer.controls[index].get('product').value.id, this.productContainer.controls[index].get('product').value.name);
    }
    this.productContainer.removeAt(index);
    this.updateTotal();
  }

  deleteSaleProduct( productID: number, productName ) {
    let confirm = window.confirm(`¿Seguro que desea eliminar el producto "${productName}" de la factura "${this.currentSale.billNumber}"? (Esta opción no se puede deshacer)`);
    if (confirm) {
      this.salesService.deleteSaleProduct(productID).subscribe(response => {
        this.response = response['response'];
        if (this.response) {
          this.getSale(this.saleID);
        } else {
          this.message = response['message'];
        }
      })
    }
  }
  
  checkValues():boolean {
    for (let index = 0; index < this.productContainer.length; index++) {
      const product = this.productContainer.controls[index].value.product;
      const quantity = this.productContainer.controls[index].value.quantity;
      if ( (quantity > (product.stock)) || (quantity <= 0)) {
        return;
      }
    }
    return true;
  }

  //Falta aplicar el descuento del cliente
  createSale(){
    if(this.editSaleForm.valid){

      if (this.checkValues()) {
        this.salesService.updateSale(this.editSaleForm.value).subscribe( response => {
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

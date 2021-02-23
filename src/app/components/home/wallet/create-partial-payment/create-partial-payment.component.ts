import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { SalesService } from 'src/app/services/sales.service';
import { PendingSaleItem } from 'src/app/templates/sale';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PartialPaymentsService } from 'src/app/services/partial-payments.service';

@Component({
  selector: 'app-create-partial-payment',
  templateUrl: './create-partial-payment.component.html',
  styleUrls: ['./create-partial-payment.component.css']
})
export class CreatePartialPaymentComponent implements OnInit {
  partialPaymentForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  companies: ListItem[];
  branchs: ListItem[];
  currentSale: string = "";
  pendingSaleItems: PendingSaleItem[];
  showDropdown: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private authService: AuthService,
    private salesService: SalesService,
    private partialPaymentsService: PartialPaymentsService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    // Asignación de variables y método de validación
    this.partialPaymentForm = this.formBuilder.group({
      companyID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      search: [{value: '', disabled: true}, Validators.maxLength(150)],
      saleID: ['', Validators.required],
      date: [{value: '', disabled: true}, Validators.required],
      value: [{value: '', disabled: true}, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      creationUser: [ this.currentUser.id, [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      if (this.currentUser.type === 3) {
        this.form.branchID.setValue(this.currentUser.branchID);
      } else{
        this.getBranchs(this.currentUser.companyID);
      }
    }else{
      this.form.branchID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }

  get form() {
    return this.partialPaymentForm.controls;
  }

  getBranchs(companyID: number) {
    if( companyID == null || companyID == 0 )
    {
      this.branchs = [];
      this.form.branchID.setValue('');
      this.form.branchID.disable();
      this.form.saleID.setValue('');
      this.form.search.setValue('');
      this.form.search.disable();
      this.form.date.setValue('');
      this.form.date.disable();
      this.form.value.setValue('');
      this.form.value.disable();
      return;
    }
    this.branchs = [];
    this.form.saleID.setValue('');
    this.form.search.setValue('');
    this.form.search.disable();
    this.form.date.setValue('');
    this.form.date.disable();
    this.form.value.setValue('');
    this.form.value.disable();

    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
      this.form.branchID.enable();
      this.form.branchID.setValue('');
    });
  }

  enableFields() {
    if(  this.form.branchID.value == null || this.form.branchID.value == "" )
    {
      this.form.saleID.setValue('');
      this.form.search.setValue('');
      this.form.search.disable();
      this.form.date.setValue('');
      this.form.date.disable();
      this.form.value.setValue('');
      this.form.value.disable();
      return;
    }
    let today =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.form.saleID.setValue('');
    this.form.search.setValue('');
    this.form.search.enable();
    this.form.date.setValue(today);
    this.form.date.enable();
    this.form.value.setValue('');
    this.form.value.enable();
  }

  searchSale() {
    if(this.form.search.value != ''){
      if( this.form.search.value.length > 1 ){
        if (+this.form.saleID.value == 0) {
          this.salesService.searchPendingSale(this.form.companyID.value, this.form.branchID.value, this.form.search.value).subscribe( response=> {
            this.pendingSaleItems = response;
            if (this.pendingSaleItems.length > 0) {
              this.showDropdown = true;
            } else {
              this.showDropdown = false;
            }
          });
        }
      } else {
        this.showDropdown = false;
      }
    } else {
      this.showDropdown = false;
    }
  }

  deleteSearchSale(){
    this.showDropdown = false;
    this.form.search.setValue('');
    this.form.saleID.setValue('');
  }

  selectSale( item: PendingSaleItem) {
    this.form.saleID.setValue(item.id);
    let saleDetail = item.billNumber + ' - ' + item.date + ' - ' + item.client + ' - $' + this.decimalPipe.transform(item.total);
    this.form.search.setValue(saleDetail);
    this.showDropdown = false;
  }

  savePartialPayment(){
    this.submitted = true;
    if(this.partialPaymentForm.valid){
      this.partialPaymentsService.createPartialPayment(this.partialPaymentForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/ventas/cartera']);
        }
      });
    }
  }

}


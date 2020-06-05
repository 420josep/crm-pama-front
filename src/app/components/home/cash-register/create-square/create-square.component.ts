import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { SquaresService } from 'src/app/services/squares.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-square',
  templateUrl: './create-square.component.html',
  styleUrls: ['./create-square.component.css']
})
export class CreateSquareComponent implements OnInit {
  squareForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  companies: ListItem[];
  branchs: ListItem[];
  squareDate: string;
  canContinue: boolean = false;
  moneyInCash: number = 0;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private authService: AuthService,
    private squaresService: SquaresService,
    private datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    let today =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    // Asignación de variables y método de validación
    this.squareForm = this.formBuilder.group({
      date: [today, [Validators.required]],
      companyID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      userID: [this.currentUser.id, [Validators.required]],
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
    return this.squareForm.controls;
  }

  getBranchs(companyID: number) {
    this.form.branchID.setValue('');

    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
      this.form.branchID.enable();
    });
  }

  checkSquare(){
    this.squaresService.checkSquare(this.form.date.value, this.form.branchID.value).subscribe( response => {
      if(response['response']) {
        this.squaresService.getSquareData(this.form.date.value, this.form.branchID.value).subscribe( data => {
          this.squareForm.addControl('initialMoney', new FormControl('', Validators.required));
          this.squareForm.addControl('totalOutputs', new FormControl(data['totalOutputs'], Validators.required));
          this.squareForm.addControl('totalSales', new FormControl(data['totalSales'], Validators.required));
          this.squareForm.addControl('totalSalesMoney', new FormControl(data['totalSalesMoney'], Validators.required));
          this.squareForm.addControl('cash', new FormControl('', Validators.required));
          this.squareForm.addControl('mismatch', new FormControl('', Validators.required));
          this.canContinue = true;
        });
      } else {
        this.response = response['response'];
        this.message = response['message'];
        setTimeout(() => {
          this.response = true;
          this.message = '';
        }, 5000);
      }
    });
  }

  checkBrands( option:number ) {
    if (option === 2) {
      this.canContinue = !this.canContinue;
    }
    this.squareForm.removeControl('initialMoney');
    this.squareForm.removeControl('totalOutputs');
    this.squareForm.removeControl('totalSales');
    this.squareForm.removeControl('totalSalesMoney');
    this.squareForm.removeControl('cash');
    this.squareForm.removeControl('mismatch');
  }

  updateCashRegister(){
    this.moneyInCash = 0;
    this.form.mismatch.setValue('');
    let initialMoney = +this.form.initialMoney.value;
    let cash = +this.form.cash.value;

    if( (!isNaN(initialMoney) && initialMoney > 0) && (this.form.initialMoney.value.toString().length > 3) ){
      let totalOutputs = +this.form.totalOutputs.value;
      let totalSalesMoney = +this.form.totalSalesMoney.value;
      this.moneyInCash = initialMoney + totalSalesMoney - totalOutputs;
      if ( (!isNaN(cash) && cash > 0) && (this.form.cash.value.toString().length > 3) ) {
        let mismatch = cash - this.moneyInCash;
        this.form.mismatch.setValue(mismatch);
      }
    }
  }

  saveSquare(){
    this.submitted = true;
    if(this.squareForm.valid){
      
      this.squaresService.createSquare(this.squareForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/caja/cierres']);
        }
      });
    }
  }
}

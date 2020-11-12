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
  total: number = 0;

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
          this.squareForm.addControl('observation', new FormControl(''));
          this.squareForm.addControl('one', new FormControl(''));
          this.squareForm.addControl('two', new FormControl(''));
          this.squareForm.addControl('three', new FormControl(''));
          this.squareForm.addControl('four', new FormControl(''));
          this.squareForm.addControl('five', new FormControl(''));
          this.squareForm.addControl('six', new FormControl(''));
          this.squareForm.addControl('seven', new FormControl(''));
          this.squareForm.addControl('eight', new FormControl(''));
          this.squareForm.addControl('nine', new FormControl(''));
          this.squareForm.addControl('ten', new FormControl(''));
          this.squareForm.addControl('eleven', new FormControl(''));
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
    this.squareForm.removeControl('observation');
    this.squareForm.removeControl('one');
    this.squareForm.removeControl('two');
    this.squareForm.removeControl('three');
    this.squareForm.removeControl('four');
    this.squareForm.removeControl('five');
    this.squareForm.removeControl('six');
    this.squareForm.removeControl('seven');
    this.squareForm.removeControl('eight');
    this.squareForm.removeControl('nine');
    this.squareForm.removeControl('ten');
    this.squareForm.removeControl('eleven');
  }

  checkValues() {
    let one = this.form.one.value;
    let two = this.form.two.value;
    let three = this.form.three.value;
    let four = this.form.four.value;
    let five = this.form.five.value;
    let six = this.form.six.value;
    let seven = this.form.seven.value;
    let eight = this.form.eight.value;
    let nine = this.form.nine.value;
    let ten = this.form.ten.value;
    let eleven = this.form.eleven.value;

    this.total = (one*100000) + (two*50000) + (three*20000) + (four*10000) + (five*5000) + (six*2000) 
      + (seven*1000) + (eight*500) + (nine*200) + (ten*100) + (eleven*50);
    
    this.form.cash.setValue(this.total);
  }

  updateCashRegister(){
    this.moneyInCash = 0;
    this.form.mismatch.setValue('');
    let initialMoney = +this.form.initialMoney.value;
    let cash = +this.form.cash.value;

    if( (!isNaN(initialMoney) && initialMoney > 0) && (this.form.initialMoney.value.toString().length > 2) ){
      let totalOutputs = +this.form.totalOutputs.value;
      let totalSalesMoney = +this.form.totalSalesMoney.value;
      this.moneyInCash = initialMoney + totalSalesMoney - totalOutputs;
      if ( (!isNaN(cash) && cash > 0) && (this.form.cash.value.toString().length > 2) ) {
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

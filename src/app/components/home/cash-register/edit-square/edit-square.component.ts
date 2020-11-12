import { Component, OnInit } from '@angular/core';
import { SquaresService } from 'src/app/services/squares.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { Square } from 'src/app/templates/squares';

@Component({
  selector: 'app-edit-square',
  templateUrl: './edit-square.component.html',
  styleUrls: ['./edit-square.component.css']
})
export class EditSquareComponent implements OnInit {
  editSquareForm: FormGroup;
  existSquare: boolean = true;
  squareID: string;
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  currentUser: User;
  currentSquare: Square;
  moneyInCash: number = 0;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private squaresService: SquaresService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.squareID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;


    this.editSquareForm = this.formBuilder.group({
      squareID: [this.squareID, [Validators.required]],
      initialMoney: ['', [Validators.required]],
      cash: ['', [Validators.required]],
      mismatch: ['', [Validators.required]],
      observation: [''],
    });


    this.squaresService.getSquare(this.squareID).subscribe(response => {
      if(response){
        this.currentSquare = response;
        console.log(this.currentSquare);
      }
      else{
        this.existSquare = false;
        this.response = false;
        this.message = "El cuadre buscado no existe"
      }
    });
  }

  get form() {
    return this.editSquareForm.controls;
  }

  updateCashRegister(){
    this.moneyInCash = 0;
    this.form.mismatch.setValue('');
    let initialMoney = +this.form.initialMoney.value;
    let cash = +this.form.cash.value;

    if( (!isNaN(initialMoney) && initialMoney > 0) && (this.form.initialMoney.value.toString().length > 3) ){
      
      this.moneyInCash = initialMoney + this.currentSquare.totalSalesMoney - this.currentSquare.totalOutputs;
      if ( (!isNaN(cash) && cash > 0) && (this.form.cash.value.toString().length > 3) ) {
        let mismatch = cash - this.moneyInCash;
        this.form.mismatch.setValue(mismatch);
      }
    }
  }

  updateSquare(){
    if(this.editSquareForm.valid){
      this.squaresService.updateSquare(this.editSquareForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message']
        }else{
          this.router.navigate(['menu/caja/cierres']);
        }
      });
    }
  }

}

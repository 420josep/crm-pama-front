import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Output } from 'src/app/templates/outputs';
import { DatePipe } from '@angular/common';
import { PartialPaymentsService } from 'src/app/services/partial-payments.service';

@Component({
  selector: 'app-create-partial-payment-for-sale',
  templateUrl: './create-partial-payment-for-sale.component.html',
  styleUrls: ['./create-partial-payment-for-sale.component.css']
})
export class CreatePartialPaymentForSaleComponent implements OnInit {
  saleID: string;
  partialPaymentForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  currentOutput: Output;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
    private partialPaymentsService: PartialPaymentsService,
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.saleID = this.route.snapshot.paramMap.get("id");
    let today =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // Asignación de variables y método de validación
    this.partialPaymentForm = this.formBuilder.group({
      saleID: [+this.saleID, [Validators.required]],
      date: [today, [Validators.required]],
      value: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      creationUser: [ this.currentUser.id, [Validators.required]],
    });
  }

  get form() {
    return this.partialPaymentForm.controls;
  }

  savePartialPayment(){
    this.submitted = true;
    if(this.partialPaymentForm.valid){
      this.partialPaymentsService.createPartialPayment(this.partialPaymentForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/ventas/cartera/'+ this.saleID]);
        }
      });
    }
  }

}

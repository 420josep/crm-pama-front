import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PartialPayment } from 'src/app/templates/payments';
import { PartialPaymentsService } from 'src/app/services/partial-payments.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-partial-payment',
  templateUrl: './edit-partial-payment.component.html',
  styleUrls: ['./edit-partial-payment.component.css']
})
export class EditPartialPaymentComponent implements OnInit {
  existPayment: boolean = true;
  partialPaymentID: string;
  partialPaymentForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  currentPayment: PartialPayment;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private partialPaymentsService: PartialPaymentsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.partialPaymentID = this.route.snapshot.paramMap.get("id");

    // Asignación de variables y método de validación
    this.partialPaymentForm = this.formBuilder.group({
      partialPaymentID: [this.partialPaymentID, [Validators.required]],
      saleID: ['', [Validators.required]],
      date: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.maxLength(10)]],
    });

    this.getPartialPayment(this.partialPaymentID);
  }

  getPartialPayment( partialPaymentID: string ){
    this.partialPaymentsService.getPartialPayment(partialPaymentID).subscribe( response => {
      if(response){
        this.currentPayment = response;
        let date =  this.datePipe.transform(this.currentPayment.date, 'yyyy-MM-dd');
        this.form.saleID.setValue(this.currentPayment.saleID);
        this.form.date.setValue(date);
        this.form.value.setValue(this.currentPayment.value);
      } else {
        this.existPayment = false;
        this.response = false;
        this.message = "El abono buscado no existe";
      }

    });
  }

  get form() {
    return this.partialPaymentForm.controls;
  }

  savePayment(){
    
    this.submitted = true;
    if(this.partialPaymentForm.valid){
      this.partialPaymentsService.updatePayment(this.partialPaymentForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/ventas/cartera/'+ this.currentPayment.saleID]);
        }
      });
    }
  }

}

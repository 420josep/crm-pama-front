import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PartialPaymentsService } from 'src/app/services/partial-payments.service';
import { SalesService } from 'src/app/services/sales.service';
import { SaleForPartialPayments } from 'src/app/templates/sale';
import { User } from 'src/app/templates/user';

@Component({
  selector: 'app-see-sale',
  templateUrl: './see-sale.component.html',
  styleUrls: ['./see-sale.component.css']
})
export class SeeSaleComponent implements OnInit {
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  currentUser: User;
  existSale: boolean = true;
  saleID: string;
  currentSale: SaleForPartialPayments;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private salesService: SalesService,
    private partialPaymentsService: PartialPaymentsService,
    private decimalPipe: DecimalPipe,
    private router: Router, 
  ) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;
    this.getSale(this.saleID);
  }

  getSale( saleID: string ){
    this.salesService.getSaleForPartialPayments(saleID).subscribe( response => {
      if(response){
        this.currentSale = response;
      }else{
        this.existSale = false;
        this.response = false;
        this.message = "La venta buscada no existe"
      }
    });
  }

  deletePartialPayment( paymentID: number, date: string, value: number ) {
    let confirm = window.confirm(`¿Eliminamos el abono del ${date} por valor de $${this.decimalPipe.transform(value)}?`);
    if (confirm) {
      this.partialPaymentsService.deletePartialPayment(paymentID).subscribe( response=> {
        if(response['response']){
          this.getSale(this.saleID);
        } else {
          this.response = response['response'];
          this.message = response['message'];
        }
      });
    }

  }
}

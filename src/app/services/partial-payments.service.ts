import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { ListItem } from '../templates/global';
import { ToolsService } from './tools.service';
import { environment } from 'src/environments/environment';
import { PartialPayment } from '../templates/payments';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json; UTF8',
  })
}
@Injectable({
  providedIn: 'root'
})
export class PartialPaymentsService {
  currentUser: User;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.authService.currentUser.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
  }

  createPartialPayment(sale: any) {
    return this.http.post(environment.apiURL + 'create_partial_payment.php', sale, httpOptions);
  }

  deletePartialPayment(paymentID: number) {
    const object = {
      paymentID: paymentID,
    };
    const json = JSON.stringify(object);
    return this.http.post(environment.apiURL + 'delete_partial_payment.php', json, httpOptions);
  }

  getPartialPayment( paymentID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('paymentID', paymentID)
    .set('option', "1");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };
    
    return this.http.get<PartialPayment>(environment.apiURL + 'get_partial_payments.php', httpOptions).pipe(map( response => {
      if(response){
        const item: PartialPayment = {
          saleID: +response.saleID,
          date: response.date,
          value: +response.value,
          creationUser: response.creationUser,
        }
        return item;
      }else {
        return null;
      }
    }));
  }

  updatePayment( data: any ) {
    //let json = JSON.stringify(data);
    //console.log(json);
    return this.http.post(environment.apiURL + 'update_partial_payment.php', data, httpOptions);
  }
}

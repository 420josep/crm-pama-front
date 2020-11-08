import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { ListItem } from '../templates/global';
import { stringify } from 'querystring';
import { ProductSaleList, SaleList, Sale, EditProductSale } from '../templates/sale';
import { ToolsService } from './tools.service';
import { SquareList, Square } from '../templates/squares';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class SquaresService {
  currentUser: User;
  //server = 'http://localhost/crm_pama_back/';

  // Deploy
  server = 'https://crm-pama-back.herokuapp.com/';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  checkSquare( date: string, branchID: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('date', date)
    .set('branchID', branchID.toString())
    .set('option', "1");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get(this.server + 'get_squares.php', httpOptions);
  }

  getSquareData( date: string, branchID: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('date', date)
    .set('branchID', branchID.toString())
    .set('option', "2");

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: params
    };

    return this.http.get(this.server + 'get_squares.php', httpOptions);
  }

  createSquare(square: any) {
    return this.http.post(this.server + 'create_square.php', square, httpOptions);
  }

  getTotalSquares( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "3")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_squares.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  getSquares( text: string, offset: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "4")
    .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<SquareList[]>(this.server + 'get_squares.php', httpOptions).pipe(map( response => {
      if(response){
        let array: SquareList[] = [];
        for (let index = 0; index < response.length; index++) {
          let company, branch = "";
          let date = response[index].date;
          date = this.tools.sqlToDate(date, 2);

          if(this.currentUser.type === 1) {
            company = response[index].company;
            branch = response[index].branch;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response[index].branch;
          } else {
            company = "";
            branch = "";
          }
          const item: SquareList = {
            id: +response[index].id,
            date: date,
            totalSales: +response[index].totalSales,
            totalSalesMoney: +response[index].totalSalesMoney,
            totalOutputs: +response[index].totalOutputs,
            mismatch: +response[index].mismatch,
            branch: branch,
            company: company,
          }

          array.push(item);
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  getSquare( squareID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "5")
    .set('squareID', squareID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Square>(this.server + 'get_squares.php', httpOptions).pipe(map( response => {
      if(response){
          let company, branch = "";
          let date = this.tools.sqlToDate(response.date, 2);
          let creationDate = this.tools.sqlToDate(response.creationDate, 1);

          if(this.currentUser.type === 1) {
            company = response.company;
            branch = response.branch;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response.branch;
          } else {
            company = "";
            branch = "";
          }

          const item: Square = {
            id: +response.id,
            date: date,
            initialMoney: +response.initialMoney,
            cash: +response.cash,
            totalSalesMoney: +response.totalSalesMoney,
            totalSales: +response.totalSales,
            totalOutputs: +response.totalOutputs,
            mismatch: +response.mismatch,
            branch: branch,
            company: company,
            creationDate: creationDate,
          }

          return item;
        
      }else {
        return;
      }

    }));;
  }

  updateSquare( data: any ) {
    //let json = JSON.stringify(data);
    //console.log(json);
    return this.http.post(this.server + 'update_square.php', data, httpOptions);
  }

  deleteSquare(squareID: number) {
    const object = {
      squareID: squareID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_square.php', json, httpOptions);
  }

}

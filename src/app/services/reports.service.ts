import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json; UTF8',
  })
}
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  
  constructor(
    private http: HttpClient,
  ) { }

  getReport(sale: any) {
    let data = JSON.stringify(sale);
    console.log(data);


    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
        params: sale
    };
    return this.http.get(environment.apiURL + 'reports.php', httpOptions);
  }
}

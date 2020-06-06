import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';
import { OutputList, Output } from '../templates/outputs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}
@Injectable({
  providedIn: 'root'
})
export class OutputsService {
  server = 'http://localhost/crm_pama_back/';
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  createOutput(output: any) {
    //let json = JSON.stringify(output);
    //console.log(json);
    return this.http.post(this.server + 'create_output.php', output, httpOptions);
  }

  getTotalOutputs( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "1")

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_outputs.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  getOutputs( text: string, offset: number ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "2")
    .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<OutputList[]>(this.server + 'get_outputs.php', httpOptions).pipe(map( response => {
      if(response){
        let array: OutputList[] = [];
        for (let index = 0; index < response.length; index++) {
          let company, branch, creationUser = "";
          let date = response[index].date;
          date = this.tools.sqlToDate(date, 2);

          if(this.currentUser.type === 1) {
            company = response[index].company;
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else if(this.currentUser.type === 2) {
            company = "";
            branch = response[index].branch;
            creationUser = response[index].creationUser;
          } else {
            company = "";
            branch = "";
            creationUser = "";
          }
          const item: OutputList = {
            id: +response[index].id,
            description: response[index].description,
            value: +response[index].value,
            branch: branch,
            company: company,
            creationUser: creationUser,
            date: date,
          }
          array.push(item);
        }
        return array;
      }else {
        return [];
      }

    }));
  }

  deleteOutput(outputID: number) {
    const object = {
      outputID: outputID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_output.php', json, httpOptions);
  }

  getOutput( outputID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('option', "3")
    .set('outputID', outputID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Output>(this.server + 'get_outputs.php', httpOptions).pipe(map( response => {
      if(response){
          let company, date = "";
          date = this.tools.sqlToDate(response.date, 1);
          let branch, companyID = 0;
          if(this.currentUser.type === 1) {
            company = response.company;
            branch = +response.branchID;
            companyID = +response.companyID;
          } else if(this.currentUser.type === 2) {
            company = "";
            companyID = 0;
            branch = +response.branchID;
          } else {
            company = "";
            companyID = 0;
            branch = 0;
          }

          const item: Output = {
            id: +response.id,
            description: response.description,
            value: +response.value,
            branchID: branch,
            companyID: companyID,
            company: company,
            date: date,
          }
          return item;
        
      }else {
        return;
      }

    }));;
  }

  updateOutput( data: any ) {
    //let json = JSON.stringify(data);
    //console.log(json);
    return this.http.post(this.server + 'update_output.php', data, httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { map } from 'rxjs/operators';
import { BranchOffice, BranchOfficeListItem } from '../templates/company';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; UTF8',
  })
}

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {
  server = 'http://localhost/crm_pama_back/';
  currentUser: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tools: ToolsService
  ) {
    this.currentUser = this.authService.getUser;
  }

  createBranchOffice(branch: any) {
    return this.http.post(this.server + '/create_branch_office.php', branch, httpOptions);
  }

  getTotalBranchs( text: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('word', text)
    .set('option', "1");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_branch_offices.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  /** POST: add a new hero to the database */
  getBranchs( text: string, offset: number ) {
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
    
    return this.http.get<BranchOfficeListItem[]>(this.server + 'get_branch_offices.php', httpOptions).pipe(map( response => {
      if(response){
        let arrayBranchs: BranchOfficeListItem[] = [];
        for (let index = 0; index < response.length; index++) {
          let creationDate = response[index].creationDate;
          creationDate = this.tools.sqlToDate(creationDate, 1);

          if(this.currentUser.type === 1) {
            let state = response[index]['state']==='1'? 'Activo': 'Inactivo';
            const item: BranchOfficeListItem = {
              id: +response[index].id,
              name: response[index].name,
              usersNumber: +response[index].usersNumber,
              company: response[index].company,
              city: response[index].city,
              creationDate: creationDate,
              state: state,
            }
            arrayBranchs.push(item);
          } else {
            const item: BranchOfficeListItem = {
              id: +response[index].id,
              name: response[index].name,
              usersNumber: +response[index].usersNumber,
              company: '',
              city: response[index].city,
              creationDate: creationDate,
              state: '',
            }
            arrayBranchs.push(item);
          }
        }
        return arrayBranchs;
      }else {
        return [];
      }

    }));
  }


  /** POST: add a new hero to the database */
  getBranch( branchID: string ) {
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', this.currentUser.companyID.toString())
    .set('branchID', branchID)
    .set('option', "3");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<BranchOffice>(this.server + 'get_branch_offices.php', httpOptions).pipe(map( response => {
      if(response){
        let creationDate = response.creationDate;
        creationDate = this.tools.sqlToDate(creationDate, 1);

        const item: BranchOffice = {
          id: +response.id,
          name: response.name,
          companyID: +response.companyID,
          countryID: +response.countryID,
          provinceID: +response.provinceID,
          cityID: +response.cityID,
          creationUser: +response.creationUser,
          creationDate: creationDate,
          state: response.state,
        }
        return item;

      }else {
        return null;
      }

    }));
  }

  updateBranch( data: any ) {
    let json = JSON.stringify(data);
    return this.http.post(this.server + 'update_branch.php', json, httpOptions);
  }

  getBranchItems( companyID: string ){
    const params = new HttpParams()
    .set('userID', this.currentUser.id.toString())
    .set('companyID', companyID)
    .set('option', "4");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_branch_offices.php', httpOptions).pipe(map( response => {
      if(response){
        let array: ListItem[] = [];
        for (let index = 0; index < response.length; index++) {
          const item: ListItem = {
            id: +response[index].id,
            name: response[index].name,
          }
          array.push(item);
        }        
        return array;
      }else {
        return [];
      }

    }));
  }

  deleteBranch(branchID: string) {
    const object = {
      branchID: branchID,
    };
    const json = JSON.stringify(object);
    return this.http.post(this.server + 'delete_branch.php', json, httpOptions);
  }

  getLastBillNumber ( branchID: number ) {
    const params = new HttpParams()
    .set('branchID', branchID.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_last_bill_number.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }
}

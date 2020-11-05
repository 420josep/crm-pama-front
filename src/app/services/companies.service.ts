import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PricingItem, CompanyListItem, Company } from '../templates/company';
import { ToolsService } from './tools.service';
import { ListItem } from '../templates/global';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
  })
}
@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  server = 'http://localhost/crm_pama_back/';

  constructor(
    private http: HttpClient, 
    private tools: ToolsService
  ) { }

  getPricing(){
    return this.http.get<PricingItem[]>(this.server + 'get_pricing_items.php', httpOptions).pipe(map( response => {
      if(response){
        let array: PricingItem[] = [];
        for (let index = 0; index < response.length; index++) {
          const item: PricingItem = {
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

  /**
   * Servicio que crea un bono
   * @param coupon Formulario con los datos del bono a crear
  */
  createCompany(company: any) {
    return this.http.post(this.server + '/create_company.php', company, { reportProgress: true, observe: 'events' });
  }

  getTotalCompanies(text: string) {
    const params = new HttpParams()
      .set('word', text)
      .set('option', "1");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<number>(this.server + 'get_companies.php', httpOptions).pipe(map( response => {
      if(response){
        return +response;
      }else {
        return 0;
      }
    }));
  }

  /** POST: add a new hero to the database */
  getCompanies(text: string, offset: number) {
    const params = new HttpParams()
      .set('word', text)
      .set('option', "2")
      .set('offset', offset.toString());

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<CompanyListItem[]>(this.server + 'get_companies.php', httpOptions).pipe(map( response => {
      if(response){
        let arrayUsers: CompanyListItem[] = [];
        for (let index = 0; index < response.length; index++) {
          let creationDate = response[index].creationDate;
          if(creationDate){
            creationDate = this.tools.sqlToDate(creationDate, 1);
          }else {
            creationDate = "";
          }
          let state = response[index]['state']==='1'? 'Activo': 'Inactivo';
          const userItem: CompanyListItem = {
            id: +response[index].id,
            name: response[index].name,
            manager: response[index].manager,
            usersNumber: +response[index].usersNumber,
            pricing: response[index].pricing,
            creationDate: creationDate,
            state: state,
          }
          arrayUsers.push(userItem);
        }
        return arrayUsers;
      }else {
        return [];
      }

    }));
  }

  getCompany( companyID: string ) {
    const params = new HttpParams()
    .set('option', "3")
    .set('companyID', companyID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<Company>(this.server + 'get_companies.php', httpOptions).pipe(map( response => {
      if(response){
        const company: Company = {
          id: +response.id,
          logo: response.logo,
          name: response.name,
          manager: response.manager,
          contact: response.contact,
          pricingID: +response.pricingID,
          creationDate: '',
          state: response.state
        }
        
        return company;
      }else {
        return;
      }

    }));
  }

  /**
   * Método que obtiene el total de bonos para el paginador
   * @param text parámetro por si se realiza una búsqueda
   */
  getCompaniesList() {
    // se le pasan como parámetros la opción 1 que recibe el API, opción que es la de traer
    // el total de proveedores, ya sea basados en una búsqueda o el total neto de proveedores
    const params = new HttpParams()
      .set('option', "4");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(this.server + 'get_companies.php', httpOptions).pipe(map( response => {
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

  updateCompany( company: any ) {
    return this.http.post(this.server + '/update_company.php', company, { reportProgress: true, observe: 'events' });
  }

}

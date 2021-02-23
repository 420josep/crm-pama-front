import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ListItem } from '../templates/global';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Sep", "Oct", "Nov", "Dic"];
const largeMonths = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Método usado para convertir una fecha basado en un string a un formato más amigable
   * DD: días en valores numéricos; MMm: Mes en texto de manera abreviada
   * MMM: Mes en texto con nombre del mes completo; AAAA: Año completo en números
   * MMn: Mes en números
   * @param date Fecha que será convertida al formato deseado
   * @param option 1: "DD-MMm-AAAAA"; 2: "DD MMm AAAAA"; 3: "DD de MMM de AAAA"; 4: "DD/MMn/AAAA"
   */
  formattedDate(date: Date, option: number): string {
    let newDate = '';
    switch (option) {
      case 1:
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let newHour = "";
        if (hours.toString().length < 2) {
          newHour = "0" + hours;
        } else {
          newHour = hours.toString();
        }
        let newMinutes = "";
        if (minutes.toString().length < 2) {
          newMinutes = "0" + minutes;
        } else {
          newMinutes = minutes.toString();
        }
        var strTime = newHour + ':' + newMinutes + ampm;
        newDate =  strTime + " " + date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear();
        break;
      case 2:
        if (date.getDate().toString().length < 2) {
          let newDay = "0" + date.getDate();
          newDate = newDay + "/" + months[date.getMonth()] + "/" + date.getFullYear();
        } else  {
          newDate = date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear();
        }
        break;
      case 3:
        newDate =  date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        break;
    }
    return newDate;
  }

  /**
   * Método usado para cambiar el string de fecha devuelto por la base de datos en un formato de fecha legible
   * @param sqlDate string con la fecha de base de datos
   */
  sqlToDate(sqlDate, option: number){
    //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
    var arrayOne = sqlDate.split("-");
    //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
    var year = arrayOne[0];
    var month = (Number(arrayOne[1]) - 1);
    var arrayTwo = arrayOne[2].split(" ");
    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
    var day = arrayTwo[0];  
    var arrayThree = arrayTwo[1].split(":");
    var hour = arrayThree[0];
    var minutes = arrayThree[1];
    var seconds = arrayThree[2];     
    return this.formattedDate( new Date(year,month,day, hour, minutes, seconds), option );
  }

  /**
   * Método que obtiene el total de bonos para el paginador
   * @param text parámetro por si se realiza una búsqueda
   */
  getCountries() {
    // se le pasan como parámetros la opción 1 que recibe el API, opción que es la de traer
    // el total de proveedores, ya sea basados en una búsqueda o el total neto de proveedores
    const params = new HttpParams()
      .set('option', "1");

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(environment.apiURL + 'get_geography.php', httpOptions).pipe(map( response => {
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

  /**
   * Método que obtiene el total de bonos para el paginador
   * @param text parámetro por si se realiza una búsqueda
   */
  getProvinces(countryID: string) {
    // se le pasan como parámetros la opción 1 que recibe el API, opción que es la de traer
    // el total de proveedores, ya sea basados en una búsqueda o el total neto de proveedores
    const params = new HttpParams()
      .set('option', "2")
      .set('countryID', countryID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(environment.apiURL + 'get_geography.php', httpOptions).pipe(map( response => {
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

  /**
   * Método que obtiene el total de bonos para el paginador
   * @param text parámetro por si se realiza una búsqueda
   */
  getCities(provinceID: string) {
    // se le pasan como parámetros la opción 1 que recibe el API, opción que es la de traer
    // el total de proveedores, ya sea basados en una búsqueda o el total neto de proveedores
    const params = new HttpParams()
      .set('option', "3")
      .set('provinceID', provinceID);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
      params: params
    };

    return this.http.get<ListItem[]>(environment.apiURL + 'get_geography.php', httpOptions).pipe(map( response => {
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

  /**
   * Método que crea un objeto de tipo fecha basado en un String
   * @param date (AAAA-MM-DD) String que quieras convertir a Date 
   */
  createDateByString(date: string): Date {
    let arrayItems = date.split('-');
    let year = +arrayItems[0];
    let month = (+arrayItems[1]) - 1;
    let day = +arrayItems[2];
    let newDate = new Date(year, month, day);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}

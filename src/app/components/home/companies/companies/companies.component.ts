import { Component, OnInit } from '@angular/core';
import { CompanyListItem } from 'src/app/templates/company';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  searchField: string = '';
  totalCompanies: number;
  offset: number = 0;
  companies: CompanyListItem[];

  constructor( private companiesService: CompaniesService) { }

  ngOnInit() {
    this.getCompanies('');
  }

  
  getCompanies( text: string){
    this.companiesService.getTotalCompanies( text ).subscribe( total => {
      if(total){
        this.totalCompanies = total;
      }else{
        this.totalCompanies = 0;
      }
    });

    this.companiesService.getCompanies( text, this.offset ).subscribe(companies => {
      if (companies) {
        this.companies = companies;
      } else {
        this.companies = [];
      }
    });

  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getCompanies('');
  }

  searchUser(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getCompanies(this.searchField);
      }
    }else{
      this.getCompanies('');
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getCompanies('');
  }

}

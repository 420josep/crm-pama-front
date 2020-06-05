import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { DatePipe } from '@angular/common';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportForm: FormGroup;

  submitted: boolean = false;
  message: string;
  response: boolean = true;
  currentUser: User;
  companies: ListItem[];
  branchs: ListItem[];
  reportTypes: {id: number, name:string}[] = [];
  years: {id: string, name:string}[] = [];
  responseData;
  currentTypeName: string;

  constructor(
    private authService: AuthService,
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder, 
    private branchsService: BranchOfficeService,
    private datePipe: DatePipe,
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.reportTypes.push({id: 1, name:'Ventas por día'});
    this.reportTypes.push({id: 2, name:'Ventas por mes'});
    this.reportTypes.push({id: 3, name:'Ventas por años'});
    this.reportTypes.push({id: 4, name:'Top 5 mejores clientes'});
    this.reportTypes.push({id: 5, name:'Productos más vendidos'});
    this.reportTypes.push({id: 6, name:'Productos menos vendidos'});

    this.years.push({id: '2020-01-01', name:'2020'});
    this.years.push({id: '2019-01-01', name:'2019'});
    this.years.push({id: '2018-01-01', name:'2018'});

    this.reportForm = this.formBuilder.group({
      branchID: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      reportType: ['', [Validators.required]],
    });

    this.currentUser = this.authService.getUser;
    if(this.currentUser.type == 2){
      this.form.companyID.setValue(this.currentUser.companyID);
      this.getBranchs(this.currentUser.companyID);
    }else{
      this.form.branchID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }

  }

  get form() {
    return this.reportForm.controls;
  }

  getBranchs(companyID: number) {
    this.form.branchID.setValue('');
    this.removeControls();
    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
      this.form.branchID.enable();
    });
  }

  showOptions( option: number ){
    this.removeControls();
    switch (option) {
      case 1:
        this.reportForm.addControl('day', new FormControl('', Validators.required));
        break;
      case 2:
        this.reportForm.addControl('year', new FormControl('', Validators.required));
        break;
    }
  }

  removeControls(){
    this.submitted = false;
    this.reportForm.removeControl('day');
    this.reportForm.removeControl('year');
  }

  default(){
    this.submitted = false;
    this.responseData = null;
  }

  getReport(){
    if(this.reportForm.valid){
      this.reportsService.getReport(this.reportForm.value).subscribe(response => {
        if(response){
          this.submitted = true;
          this.responseData = response;
          for (let index = 0; index < this.reportTypes.length; index++) {
            const reportID = this.reportTypes[index].id;
            if ( reportID === this.form.reportType.value) {
              switch (reportID) {
                case 1:
                  this.currentTypeName = this.reportTypes[index].name + ' / ' + this.form.day.value;
                  break;
                case 2:
                  this.currentTypeName = this.reportTypes[index].name + ' / ' + this.datePipe.transform( this.form.year.value, 'yyyy');
                  break;
                case 3:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 4:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 5:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 6:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
              }
            }
            
          }
        } else {
          this.response = false;
          this.message = "La consulta no arrojó resultados";
          setTimeout(() => {
            this.response = true;
            this.message = '';
          }, 5000);
        }
        console.log(response);
      });
    }
  }


}

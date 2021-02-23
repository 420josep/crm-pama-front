import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { DatePipe } from '@angular/common';
import { ReportsService } from 'src/app/services/reports.service';
import { DecimalPipe } from '@angular/common';


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
  currentBranchName: string;
  currentReport: number = 0;

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel: string = "";
  showYAxisLabel = true;
  yAxisLabel: string = "";
  timeline = true;
  legendTitle: string = "";

  //pie
  showLabels = true;

  // Opciones del pie
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#687EA8', '#009FB2', '#5EC7D0', '#8EC756', '#C0DA7D', '#EFEA1B', '#F2BF34', '#F5934C']
  };

  secondColorScheme = {
    domain: ['#E7B020', '#A3B930', '#D2732B', '#C56D7A', '#2D9894', '#785964', '#C31933']
  };


  information: {"name": string,"value": number}[];

  // Solo para el reporte 1 del resumen del día
  secondLegend: string = "";
  secondInformation: {"name": string,"value": number}[];

  multi: any[];
  isDataSetted: boolean = false;

  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this);
  public dataLabelFormattingFn = this.formatDataLabel.bind(this);

  constructor(
    private authService: AuthService,
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder, 
    private branchsService: BranchOfficeService,
    private datePipe: DatePipe,
    private reportsService: ReportsService,
    private decimalPipe: DecimalPipe
  ) { }


  yAxisTickFormatting(value) {
    let realValue = "";
    if (this.currentReport == 8) {
      realValue = this.decimalPipe.transform(value);
    } else {
      realValue = '$' + this.decimalPipe.transform(value);
    }
    return realValue;
  }

  xAxisTickFormatting(value) {
    //console.log(value);
    return value;
  }

  formatDataLabel(value) {
    let realValue = "";
    if (this.currentReport == 8) {
      realValue = this.decimalPipe.transform(value);
    } else {
      realValue = '$' + this.decimalPipe.transform(value);
    }
    return realValue;
  }

  ngOnInit() {
    this.reportTypes.push({id: 1, name:'Resumen del día'});
    this.reportTypes.push({id: 2, name:'Ventas por meses'});
    this.reportTypes.push({id: 3, name:'Ventas de una sucursal por meses'});
    this.reportTypes.push({id: 4, name:'Ventas por años'});
    this.reportTypes.push({id: 5, name:'Top 5 mejores clientes'});
    this.reportTypes.push({id: 6, name:'Productos más vendidos'});
    this.reportTypes.push({id: 7, name:'Productos menos vendidos'});
    this.reportTypes.push({id: 8, name:'Nuevos clientes 6 meses atrás'});

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
    this.reportForm.addControl('branchID', new FormControl('', Validators.required));
    this.removeControls();
    switch (option) {
      case 1:
        this.reportForm.removeControl('branchID');
        //this.reportForm.addControl('day', new FormControl('', Validators.required));
        break;
      case 2:
        this.reportForm.removeControl('branchID');
        this.reportForm.addControl('year', new FormControl('', Validators.required));
        break;
      case 3:
        this.reportForm.addControl('year', new FormControl('', Validators.required));
        break;
      case 4:
        this.reportForm.removeControl('branchID');
        break;
      case 5:
        this.reportForm.removeControl('branchID');
        break;
      case 8:
        this.reportForm.removeControl('branchID');
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
          this.currentReport = +this.form.reportType.value;
          this.submitted = true;
          this.responseData = response;
          this.processData(this.responseData, this.currentReport);
          for (let index = 0; index < this.reportTypes.length; index++) {
            const reportID = this.reportTypes[index].id;
            if ( reportID === this.currentReport) {
              switch (reportID) {
                case 1:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 2:
                  this.currentTypeName = this.reportTypes[index].name + ' / ' + this.datePipe.transform( this.form.year.value, 'yyyy');
                  break;
                case 3:
                  let branchID = +this.form.branchID.value;

                  for (let branchIndex = 0; branchIndex < this.branchs.length ; branchIndex++) {
                    if (branchID === this.branchs[branchIndex].id) {
                      this.currentTypeName = this.reportTypes[index].name + ' / ' +  this.branchs[branchIndex].name
                      + ' / ' + this.datePipe.transform( this.form.year.value, 'yyyy');
                      break;
                    }
                  }
                  break;
                case 4:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 5:
                  this.currentTypeName = this.reportTypes[index].name;
                  break;
                case 6:
                  for (let branchIndex = 0; branchIndex < this.branchs.length ; branchIndex++) {
                    if (+this.form.branchID.value === this.branchs[branchIndex].id) {
                      this.currentTypeName = this.reportTypes[index].name + ' / ' +  this.branchs[branchIndex].name;
                      break;
                    }
                  }
                  break;
                case 7:
                  for (let branchIndex = 0; branchIndex < this.branchs.length ; branchIndex++) {
                    if (+this.form.branchID.value === this.branchs[branchIndex].id) {
                      this.currentTypeName = this.reportTypes[index].name + ' / ' +  this.branchs[branchIndex].name;
                      break;
                    }
                  }
                  break;
                case 8:
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

  processData( data: any, reportType: number) {

    switch (reportType) {
      case 1:
        data['newClients']['difference'] = data['newClients']['today'] - data['newClients']['yesterday'];
        data['totalOutputs']['difference'] = data['totalOutputs']['yesterday'] - data['totalOutputs']['today'];
        data['totalSalesAndSold']['totalSalesDifference'] = +data['totalSalesAndSold']['today'][0]['totalSales'] - +data['totalSalesAndSold']['yesterday'][0]['totalSales'];
        data['totalSalesAndSold']['totalSoldDifference'] = +data['totalSalesAndSold']['today'][0]['totalSold'] - +data['totalSalesAndSold']['yesterday'][0]['totalSold'];

        this.information = [];
        for (let index = 0; index < data['sales'].length; index++) {
          let info = {
            name: data['sales'][index]['date'],
            value: +data['sales'][index]['totalSold'],
            extra: {
              tooltipText: +data['sales'][index]['totalSales']
            }
          }
          this.information.push(info);
        }
        this.secondInformation = [];

        for (let index = 0; index < data['salesByBranch'].length; index++) {
          let info = {
            name: data['salesByBranch'][index]['branch'] + "(" + data['salesByBranch'][index]['totalSales'] + ")",
            value: +data['salesByBranch'][index]['totalSold'],
          }
          this.secondInformation.push(info);
        }
        this.showInfo('Fecha','Valor en pesos (COP)','Fecha');
        this.secondLegend = 'Sucursal (Cant ventas)';

        break;
      case 2:
        this.multi = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['month'],
            series: [
              {
                name: data[index]['branch'],
                value: data[index]['totalSold']
              }
            ]
          }
          this.multi.push(info);
        }
        this.showInfo('Mes','Valor en pesos (COP)','Sucursales');
        break;
      case 3:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['month'],
            value: +data[index]['totalSold'],
            extra: {
              tooltipText: +data[index]['totalSales']
            }
          }
          this.information.push(info);
        }
        this.showInfo('Mes','Valor en pesos (COP)','Mes');
        break;
      case 4:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['year'],
            value: +data[index]['totalSold'],
            extra: {
              tooltipText: +data[index]['totalSales']
            }
          }
          this.information.push(info);
        }
        this.showInfo('Año','Valor en pesos (COP)','Año');
        break;
      case 5:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['name'] + " (" + data[index]['totalSales'] + ")",
            value: +data[index]['totalPurchased'],
          }
          this.information.push(info);
        }
        this.showInfo('','','Cliente (Cant compras)');
        break;
      case 6:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['name'],
            value: +data[index]['timesSold'],
          }
          this.information.push(info);
        }
        this.showInfo('','','Producto');
        break;
      case 7:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['name'],
            value: +data[index]['timesSold'],
          }
          this.information.push(info);
        }
        this.showInfo('','','Producto');
        break;
      case 8:
        this.information = [];
        for (let index = 0; index < data.length; index++) {
          let info = {
            name: data[index]['date'],
            value: +data[index]['totalUsers'],
          }
          this.information.push(info);
        }
        this.showInfo('Mes','Cantidad de usuarios','Mes');
        break;
    }
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  showInfo( labelX: string, labelY: string, legend: string ) {
    this.xAxisLabel = labelX;
    this.yAxisLabel = labelY;
    this.isDataSetted = true;
    this.legendTitle = legend;
  }



}

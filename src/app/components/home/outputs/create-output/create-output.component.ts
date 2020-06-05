import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToolsService } from 'src/app/services/tools.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { OutputsService } from 'src/app/services/outputs.service';

@Component({
  selector: 'app-create-output',
  templateUrl: './create-output.component.html',
  styleUrls: ['./create-output.component.css']
})
export class CreateOutputComponent implements OnInit {
  outputForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  companies: ListItem[];
  branchs: ListItem[];

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private companiesService: CompaniesService,
    private branchsService: BranchOfficeService,
    private authService: AuthService,
    private outputServices: OutputsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;

    // Asignación de variables y método de validación
    this.outputForm = this.formBuilder.group({
      value: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      branchID: ['', [Validators.required]],
      description: ['', [Validators.required]],
      creationUser: [ this.currentUser.id, [Validators.required]],
    });
    
    if(this.currentUser.type != 1){
      this.form.companyID.setValue(this.currentUser.companyID);
      if (this.currentUser.type === 3) {
        this.form.branchID.setValue(this.currentUser.branchID);
      } else{
        this.getBranchs(this.currentUser.companyID);
      }
    }else{
      this.form.branchID.disable();
      this.companiesService.getCompaniesList().subscribe(response => {
        this.companies = response;
      });
    }
  }

  get form() {
    return this.outputForm.controls;
  }

  getBranchs(companyID: number) {
    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
      this.form.branchID.enable();
    });
  }

  saveOutput(){
    this.submitted = true;
    if(this.outputForm.valid){
      this.outputServices.createOutput(this.outputForm.value).subscribe( response => {
        this.response = response['response'];
        if(!this.response){
          this.message = response ['message'];
        }else{
          this.router.navigate(['menu/gastos/lista']);
        }
      });
    }
  }

}

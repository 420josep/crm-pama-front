import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/templates/user';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToolsService } from 'src/app/services/tools.service';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { ListItem } from 'src/app/templates/global';
import { AuthService } from 'src/app/services/auth.service';
import { OutputsService } from 'src/app/services/outputs.service';
import { Output } from 'src/app/templates/outputs';

@Component({
  selector: 'app-edit-output',
  templateUrl: './edit-output.component.html',
  styleUrls: ['./edit-output.component.css']
})
export class EditOutputComponent implements OnInit {
  existOutput: boolean = true;
  outputID: string;
  editOutputForm: FormGroup;
  submitted: boolean = false;
  currentUser: User;
  message: string;
  response: boolean = true;
  companies: ListItem[];
  branchs: ListItem[];
  currentOutput: Output;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private companiesService: CompaniesService,
    private tools: ToolsService,
    private branchsService: BranchOfficeService,
    private authService: AuthService,
    private outputServices: OutputsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.outputID = this.route.snapshot.paramMap.get("id");

    // Asignación de variables y método de validación
    this.editOutputForm = this.formBuilder.group({
      outputID: [this.outputID, [Validators.required]],
      value: ['', [Validators.required, Validators.maxLength(10)]],
      branchID: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
    });
    if(this.currentUser.type === 3){
      this.form.branchID.setValue(this.currentUser.branchID);
    } else if(this.currentUser.type === 2){
      this.getBranchs(this.currentUser.companyID);
    }
    this.getOutput(this.outputID);
  }

  getOutput( outputID: string ){
    this.outputServices.getOutput(outputID).subscribe( response => {
      if(response){
        this.currentOutput = response;
        console.log(this.currentOutput);
        if(this.currentUser.type === 3){
          this.form.branchID.setValue(this.currentUser.branchID);
        } else if(this.currentUser.type === 2){
          this.form.branchID.setValue(this.currentOutput.branchID);
        } else {
          this.form.branchID.setValue(this.currentOutput.branchID);
          this.getBranchs(this.currentOutput.companyID);
        }
        this.form.description.setValue(this.currentOutput.description);
        this.form.value.setValue(this.currentOutput.value);
      }else{
        this.existOutput = false;
        this.response = false;
        this.message = "El gasto buscado no existe"
      }
    });
  }

  get form() {
    return this.editOutputForm.controls;
  }

  getBranchs(companyID: number) {
    this.branchsService.getBranchItems(companyID.toString()).subscribe(response => {
      this.branchs = response;
      console.log(this.branchs);
      this.form.branchID.enable();
    });
  }

  saveOutput(){
    this.submitted = true;
    if(this.editOutputForm.valid){
      this.outputServices.updateOutput(this.editOutputForm.value).subscribe( response => {
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

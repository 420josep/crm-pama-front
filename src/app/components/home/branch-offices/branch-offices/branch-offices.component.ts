import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { BranchOfficeListItem } from 'src/app/templates/company';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';

@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.css']
})
export class BranchOfficesComponent implements OnInit {
  searchField: string = '';
  totalUsers: number;
  offset: number = 0;
  branchs: BranchOfficeListItem[];
  currentUser: User;

  constructor( 
    private branchsService: BranchOfficeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getBranchs('');
  }

  
  getBranchs( text: string){
    this.branchsService.getTotalBranchs( text ).subscribe( total => {
        this.totalUsers = total;
    });

    this.branchsService.getBranchs( text, this.offset ).subscribe(companies => {
      this.branchs = companies;
    });

  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getBranchs('');
  }

  searchUser(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getBranchs(this.searchField);
      }
    }else{
      this.getBranchs('');
    }
  }

  deleteBranch( branchID: number, branchName: string) {
    let confirm = window.confirm(`¿Eliminamos la sucursal "${branchName}"?`);
    if (confirm) {
      this.branchsService.deleteBranch( branchID.toString() ).subscribe( response => {
        if(response['response']){
          this.getBranchs('');
        }
      });
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getBranchs('');
  }
}

import { Component, OnInit } from '@angular/core';
import { OutputsService } from 'src/app/services/outputs.service';
import { User } from 'src/app/templates/user';
import { OutputList } from 'src/app/templates/outputs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.css']
})
export class OutputsComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalOutputs: number;
  offset: number = 0;
  outputs: OutputList[];

  constructor(
    private authService: AuthService, 
    private outputsService: OutputsService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getSales('');
  }

  getSales( text: string){
    this.outputsService.getTotalOutputs( text ).subscribe( total => {
        this.totalOutputs = total;
    });

    this.outputsService.getOutputs( text, this.offset ).subscribe(outputs => {
      this.outputs = outputs;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getSales('');
  }

  searchClient(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getSales(this.searchField);
      }
    }else{
      this.getSales('');
    }
  }

  deleteSearch(){
    this.searchField = '';
    this.getSales('');
  }

  deleteOutput( outputID: number, outputName: string) {
    let confirm = window.confirm(`¿Eliminamos el proveedor "${outputName}"?`);
    if (confirm) {
      this.outputsService.deleteOutput(outputID).subscribe( response => {
        if(response['response']){
          this.getSales('');
        }
      });
    }
  }

}

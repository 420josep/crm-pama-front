import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';
import { EntriesList } from 'src/app/templates/entries';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  searchField: string = '';
  totalEntries: number;
  offset: number = 0;
  entries: EntriesList[];
  currentUser: User;

  constructor(
    private authService: AuthService,
    private entriesService: EntriesService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getEntries('');
  }

  
  getEntries( text: string ){
    this.entriesService.getTotalEntries( text ).subscribe( total => {
      this.totalEntries = total;
    });

    this.entriesService.getEntries( text, this.offset ).subscribe(entries => {
      this.entries = entries;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getEntries('');
  }

  deleteSearch(){
    this.searchField = '';
    this.getEntries('');
  }

  searchEntries(){
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.offset = 0;
        this.getEntries(this.searchField);
      }
    }else{
      this.getEntries('');
    }
  }

  deleteEntry( entryID: number, billNumber: number ) {
    let confirm = window.confirm(`¿Eliminamos la entrada de mercancía de la factura "${billNumber}"?`);
    if (confirm) {
      this.entriesService.deleteEntry(entryID).subscribe( response => {
        if(response['response']){
          this.getEntries('');
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/app/services/entries.service';
import { Entry } from 'src/app/templates/entries';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-see-entry',
  templateUrl: './see-entry.component.html',
  styleUrls: ['./see-entry.component.css']
})
export class SeeEntryComponent implements OnInit {
  currentEntry: Entry;
  existEntry: boolean = true;
  submitted: boolean = false;
  message: string;
  response: boolean = true;
  entryID: string;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private entriesService: EntriesService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    this.entriesService.getEntry(this.entryID).subscribe(response => {
      if(response){
        this.currentEntry = response;
      }
      else{
        this.existEntry = false;
        this.response = false;
        this.message = "La entrada buscada buscado no existe"
      }
    });
  }

}

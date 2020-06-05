import { Component, OnInit } from '@angular/core';
import { SquareList } from 'src/app/templates/squares';
import { SquaresService } from 'src/app/services/squares.service';
import { User } from 'src/app/templates/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-squares',
  templateUrl: './squares.component.html',
  styleUrls: ['./squares.component.css']
})
export class SquaresComponent implements OnInit {
  currentUser: User;
  searchField: string = '';
  totalSquares: number;
  offset: number = 0;
  squares: SquareList[];

  constructor(
    private authService: AuthService, 
    private squaresService: SquaresService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser;
    this.getSquares('');
  }

  getSquares( text: string){
    this.squaresService.getTotalSquares( text ).subscribe( total => {
      this.totalSquares = total;
    });

    this.squaresService.getSquares( text, this.offset ).subscribe(squares => {
      this.squares = squares;
    });
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getSquares('');
  }

  deleteSquare( squareID: number, squareName: string) {
    let confirm = window.confirm(`¿Eliminamos el cuadre del día "${squareName}"?`);
    if (confirm) {
      this.squaresService.deleteSquare(squareID).subscribe( response => {
        if(response['response']){
          this.getSquares('');
        }
      });
    }
  }

}

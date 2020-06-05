import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnChanges {
  @Input() total: number;
  @Input() limit: number;
  
  currentPage: number = 1;
  maxPage: number = 1;
  offset: number = 0;

  // Usamos el decorador Output
  @Output() updateCurrentPage = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.maxPage = Math.ceil( this.total / this.limit);
  }

  // Cuando se lance el evento click en la plantilla llamaremos a este método
  nextPage() {
    if(this.currentPage < this.maxPage){
      this.currentPage++;
      this.offset += this.limit;
    }
    // Usamos el método emit
    this.updateCurrentPage.emit({ offset: this.offset });
  }

  prevPage() {
    if(this.currentPage > 1){
      this.currentPage--;
      this.offset -= this.limit;
    }
    // Usamos el método emit
    this.updateCurrentPage.emit({ offset: this.offset });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentPage = 1;
    this.maxPage = Math.ceil( this.total / this.limit);
    this.offset = 0;
    // changes.prop contains the old and the new value...
  }


}

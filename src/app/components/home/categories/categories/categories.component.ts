import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Category, Subcategory } from 'src/app/templates/category';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { ListItem } from 'src/app/templates/global';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  newCategoryForm: FormGroup;
  currentUser: User;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string = '';
  createMessage: string = '';
  // Variable para ayudar a identificar dónde van los mensajes de respuesta
  currentCategory: Category;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  categories: Category[];
  companies: ListItem[];
  searchField: string = '';
  totalCategories: number;
  offset: number = 0;

  constructor( 
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private categoriesService: CategoryService,
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    // Asignación de variables y método de validación
    this.newCategoryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      subcategories: this._formBuilder.array([]),
      userID: ['', Validators.required],
      companyID: ['', Validators.required]
    });

    this.currentUser = this.authService.getUser;
    this.form.userID.setValue(this.currentUser.id);
    if(this.currentUser.type === 1 ){
      this.companiesService.getCompaniesList().subscribe( response => {
        this.companies = response;
      });
    } else {
      this.form.companyID.setValue(this.currentUser.companyID);
    }
    this.getCategories('');
  }

  get form() {
    return this.newCategoryForm.controls;
  }

  get getCurrentCategory() {
    return this.currentCategory;
  }

  get subcategoryContainer(): FormArray {
    return <FormArray>this.newCategoryForm.get('subcategories')
  }

  getCategories( text: string ) {
    this.categoriesService.getTotalCategories( text ).subscribe( total => {
      if(total){
        this.totalCategories = total;
      }else{
        this.totalCategories = 0;
      }
    });

    this.categoriesService.getCategories( text, this.offset ).subscribe(categories => {
      if (categories) {
        this.categories = categories;
      } else {
        this.categories = [];
      }
    });
  }

  addNewSubcategory() {
    (this.subcategoryContainer).push(this.addSubcategoryFormGroup());
  }

  removeNewSubcategory(index: number) {
    this.subcategoryContainer.removeAt(index)
  }

  addSubcategoryFormGroup() {
    return this._formBuilder.group({
      name: ['', Validators.required]
    });
  }

  saveNewCategory() {
    if (this.newCategoryForm.valid) {
      this.categoriesService.addCategory(this.newCategoryForm.value).subscribe(response => {
        this.response = response['response'];
        if (!this.response) {
          this.createMessage = response['message']
          setTimeout(() => {
            this.response = true;
            this.createMessage = '';
          }, 2000);
        } else {
          this.form.name.setValue('');
          if(this.currentUser.type === 1 ){
            this.form.companyID.setValue('');
          } 
          this.newCategoryForm.setControl('subcategories', this._formBuilder.array([]));
          this.offset = 0;
          this.getCategories('');
        }
      });
    }
  }

  saveCategory(category: Category) {
    this.categoriesService.updateCategory( category ).subscribe(response => {
      this.response = response['response'];
      this.currentCategory = category;
      this.message = response['message'];
      setTimeout(() => {
        this.currentCategory = null;
        this.message = '';
        if (this.response) this.getCategories('');
      }, 2000);

    })
  }

  addSubcategory(category: Category) {
    const newSubcategory: Subcategory = {
      id: null,
      name: ''
    }
    category.subcategories.push(newSubcategory);
  }

  removeSubcategory(category: Category, index: number) {
    let subcategoryId = category.subcategories[index].id;

    if (subcategoryId) {
      let subcategoryName = category.subcategories[index].name;

      let confirm = window.confirm(`¿Seguro que desea eliminar la subcategoría "${subcategoryName}"?`);
      if (confirm) {
        this.categoriesService.deleteSubcategory(subcategoryId).subscribe(response => {
          if (response['response']) {
            this.currentCategory = category;
            this.message = response['message'];
            setTimeout(() => {
              this.currentCategory = null;
              this.message = '';
              this.getCategories('');
            }, 2000);
          }
        });
      }

    } else {
      category.subcategories.splice(index, 1);

    }

  }

  deleteCategory(category: Category) {
    let confirm = window.confirm(`¿Seguro que desea eliminar la categoría "${category.name}"?`);
    if (confirm) {
      this.categoriesService.deleteCategory(category.id).subscribe(response => {
        this.response = response['response'];
        if (this.response) {
          this.offset = 0;
          this.getCategories('');
        } else {
          this.message = response['message'];
        }
      })
    }
  }

  searchCategory(){
    console.log(this.searchField);
    if(this.searchField != ''){
      if( this.searchField.length > 1 ){
        this.getCategories(this.searchField);
      }
    }else{
      this.getCategories('');
    }
  }

  updatePaginator( event ){
    this.offset = event.offset;
    this.getCategories('');
  }

  deleteSearch(){
    this.searchField = '';
    this.getCategories('');
  }

}

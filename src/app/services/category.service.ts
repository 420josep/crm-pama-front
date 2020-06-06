import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Category, Subcategory } from '../templates/category';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../templates/user';
import { stringify } from 'querystring';
import { ListItem } from '../templates/global';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json; UTF8',
    })
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    currentUser: User;
    server = 'http://localhost/crm_pama_back/';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { 
        this.currentUser = this.authService.getUser;
    }

    /** POST: add a new hero to the database */
    addCategory(json: any) {
        return this.http.post(this.server + 'create_category.php', json, httpOptions);
    }

    /** POST: add a new hero to the database */
    getCategories( text: string, offset: number ) {
        const params = new HttpParams()
        .set('userID', this.currentUser.id.toString())
        .set('companyID', this.currentUser.companyID.toString())
        .set('word', text)
        .set('option', "2")
        .set('offset', offset.toString());
    
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
          params: params
        };

        return this.http.get<Category[]>(this.server + 'get_categories.php', httpOptions).pipe(map(categories => {
            if (categories) {
                let items: Category[] = [];
                for (let index = 0; index < categories.length; index++) {
                    this.getSubcategories(categories[index].id).subscribe(subcategoriesArray => {
                        if (!subcategoriesArray) {
                            if (this.currentUser.type === 1) {
                                const item: Category = {
                                    id: +categories[index].id,
                                    name: categories[index].name,
                                    company: categories[index].company,
                                    companyID: +categories[index].companyID,
                                    subcategories: []
                                }
                                items.push(item);
                            } else {
                                const item: Category = {
                                    id: +categories[index].id,
                                    name: categories[index].name,
                                    company: categories[index].company,
                                    companyID: this.currentUser.companyID,
                                    subcategories: []
                                }
                                items.push(item);
                            }

                        } else {
                            if (this.currentUser.type === 1) {
                                const item: Category = {
                                    id: +categories[index].id,
                                    name: categories[index].name,
                                    company: categories[index].company,
                                    companyID: +categories[index].companyID,
                                    subcategories: subcategoriesArray
                                }
                                items.push(item);
                            } else {
                                const item: Category = {
                                    id: +categories[index].id,
                                    name: categories[index].name,
                                    company: categories[index].company,
                                    companyID: this.currentUser.companyID,
                                    subcategories: subcategoriesArray
                                }
                                items.push(item);
                            }
                        }
                    });
                }
                return items;
              }else {
                return [];
              }
        }));
    }

    getSubcategories(categoryID: number) {
        const params = new HttpParams()
        .set('categoryId', categoryID.toString());

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
            params: params
          };

        return this.http.get<Subcategory[]>(this.server + 'get_subcategories.php', httpOptions).pipe(map(categories => {
            if (categories) {
                let items: Subcategory[] = [];
                for (let index = 0; index < categories.length; index++) {
                    const item: Subcategory = {
                        id: +categories[index].id,
                        name: categories[index].name,
                    }
                    items.push(item);
                }
                return items;
            }else {
                return [];
            }
        }));
    }


    getTotalCategories( text: string ) {
        const params = new HttpParams()
        .set('userID', this.currentUser.id.toString())
        .set('companyID', this.currentUser.companyID.toString())
        .set('word', text)
        .set('option', "1");
    
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
          params: params
        };
    
        return this.http.get<number>(this.server + 'get_categories.php', httpOptions).pipe(map( response => {
          if(response){
            return +response;
          }else {
            return 0;
          }
        }));
    }

    deleteSubcategory(subcategoryID: number) {
        const object = {
            subcategoryID: subcategoryID,
        };
        const json = JSON.stringify(object);
        return this.http.post(this.server + 'delete_subcategory.php', json, httpOptions);
    }

    deleteCategory( categoryID: number) {
        const object = {
            categoryID: categoryID,
        };
        const json = JSON.stringify(object);
        return this.http.post(this.server + 'delete_category.php', json, httpOptions);
    }

    updateCategory( data: Category ) {
        const object = {
            userID: this.currentUser.id.toString(),
            category: data,
        };
        let json = JSON.stringify(object);
        console.log(json)
        return this.http.post(this.server + 'update_category.php', json, httpOptions);
    }


    /** POST: add a new hero to the database */
    getCategoriesList( companyID: number ) {
        const params = new HttpParams()
        .set('userID', this.currentUser.id.toString())
        .set('companyID', companyID.toString())
        .set('option', "3");
    
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; UTF8' }),
            params: params
        };

        return this.http.get<ListItem[]>(this.server + 'get_categories.php', httpOptions).pipe(map(categories => {
            if (categories) {
                let items: ListItem[] = [];
                for (let index = 0; index < categories.length; index++) {
                    const item: ListItem = {
                        id: +categories[index].id,
                        name: categories[index].name,
                    }
                    items.push(item);
                }
                return items;
            }else {
                return [];
            }
        }));
    }
}

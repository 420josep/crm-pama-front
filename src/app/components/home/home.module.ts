import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NewProviderComponent } from './providers/new-provider/new-provider.component';
import { ProvidersComponent } from './providers/providers/providers.component';
import { EditProviderComponent } from './providers/edit-provider/edit-provider.component';
import { PaginatorModule } from '../paginator/paginator.module';
import { NewProductComponent } from './products/new-product/new-product.component';
import { CategoriesComponent } from './categories/categories/categories.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { UsersComponent } from './users/users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { CreateCompanyComponent } from './companies/create-company/create-company.component';
import { EditCompanyComponent } from './companies/edit-company/edit-company.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { CreateBranchComponent } from './branch-offices/create-branch/create-branch.component';
import { EditBranchComponent } from './branch-offices/edit-branch/edit-branch.component';
import { BranchOfficesComponent } from './branch-offices/branch-offices/branch-offices.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { CreateEntryComponent } from './entries/create-entry/create-entry.component';
import { EntriesComponent } from './entries/entries/entries.component';
import { SeeEntryComponent } from './entries/see-entry/see-entry.component';
import { StockComponent } from './stock/stock.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { ClientsComponent } from './clients/clients/clients.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { CreateSaleComponent } from './sales/create-sale/create-sale.component';
import { SalesComponent } from './sales/sales/sales.component';
import { EditSaleComponent } from './sales/edit-sale/edit-sale.component';
import { CreateOutputComponent } from './outputs/create-output/create-output.component';
import { OutputsComponent } from './outputs/outputs/outputs.component';
import { EditOutputComponent } from './outputs/edit-output/edit-output.component';
import { CreateSquareComponent } from './cash-register/create-square/create-square.component';
import { SquaresComponent } from './cash-register/squares/squares.component';
import { EditSquareComponent } from './cash-register/edit-square/edit-square.component';
import { ReportsComponent } from './reports/reports.component';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptorService } from 'src/app/services/interceptor';
import { QuickStartComponent } from './quick-start/quick-start.component';
import { QuotationComponent } from './quotation/quotation.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SeeSalesComponent } from './wallet/see-sales/see-sales.component';
import { CreatePartialPaymentComponent } from './wallet/create-partial-payment/create-partial-payment.component';
import { EditPartialPaymentComponent } from './wallet/edit-partial-payment/edit-partial-payment.component';
import { SeeSaleComponent } from './wallet/see-sale/see-sale.component';
import { CreatePartialPaymentForSaleComponent } from './wallet/create-partial-payment-for-sale/create-partial-payment-for-sale.component';

@NgModule({
  declarations: [
    HomeComponent,
    NewProviderComponent,
    ProvidersComponent,
    EditProviderComponent,
    NewProductComponent,
    CategoriesComponent,
    CreateUserComponent,
    UsersComponent,
    EditUserComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    CompaniesComponent,
    CreateBranchComponent,
    EditBranchComponent,
    BranchOfficesComponent,
    ProductsListComponent,
    EditProductComponent,
    CreateEntryComponent,
    EntriesComponent,
    SeeEntryComponent,
    StockComponent,
    CreateClientComponent,
    ClientsComponent,
    EditClientComponent,
    CreateSaleComponent,
    SalesComponent,
    EditSaleComponent,
    CreateOutputComponent,
    OutputsComponent,
    EditOutputComponent,
    CreateSquareComponent,
    SquaresComponent,
    EditSquareComponent,
    ReportsComponent,
    QuickStartComponent,
    QuotationComponent,
    SeeSalesComponent,
    CreatePartialPaymentComponent,
    EditPartialPaymentComponent,
    SeeSaleComponent,
    CreatePartialPaymentForSaleComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    PipesModule.forRoot(),
    NgxChartsModule
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptorService, multi: true }
  ]
})
export class HomeModule { }

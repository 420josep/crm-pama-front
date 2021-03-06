import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewProviderComponent } from './providers/new-provider/new-provider.component';
import { ProvidersComponent } from './providers/providers/providers.component';
import { EditProviderComponent } from './providers/edit-provider/edit-provider.component';
import { NewProductComponent } from './products/new-product/new-product.component';
import { CategoriesComponent } from './categories/categories/categories.component';
import { UsersComponent } from './users/users/users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { CreateCompanyComponent } from './companies/create-company/create-company.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { EditCompanyComponent } from './companies/edit-company/edit-company.component';
import { CreateBranchComponent } from './branch-offices/create-branch/create-branch.component';
import { BranchOfficesComponent } from './branch-offices/branch-offices/branch-offices.component';
import { EditBranchComponent } from './branch-offices/edit-branch/edit-branch.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { EntriesComponent } from './entries/entries/entries.component';
import { CreateEntryComponent } from './entries/create-entry/create-entry.component';
import { SeeEntryComponent } from './entries/see-entry/see-entry.component';
import { StockComponent } from './stock/stock.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { ClientsComponent } from './clients/clients/clients.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { CreateSaleComponent } from './sales/create-sale/create-sale.component';
import { SalesComponent } from './sales/sales/sales.component';
import { EditSaleComponent } from './sales/edit-sale/edit-sale.component';
import { CreateSquareComponent } from './cash-register/create-square/create-square.component';
import { SquaresComponent } from './cash-register/squares/squares.component';
import { EditSquareComponent } from './cash-register/edit-square/edit-square.component';
import { CreateOutputComponent } from './outputs/create-output/create-output.component';
import { OutputsComponent } from './outputs/outputs/outputs.component';
import { EditOutputComponent } from './outputs/edit-output/edit-output.component';
import { ReportsComponent } from './reports/reports.component';
import { QuickStartComponent } from './quick-start/quick-start.component';
import { QuotationComponent } from './quotation/quotation.component';
import { SeeSalesComponent } from './wallet/see-sales/see-sales.component';
import { SeeSaleComponent } from './wallet/see-sale/see-sale.component';
import { EditPartialPaymentComponent } from './wallet/edit-partial-payment/edit-partial-payment.component';
import { CreatePartialPaymentComponent } from './wallet/create-partial-payment/create-partial-payment.component';
import { CreatePartialPaymentForSaleComponent } from './wallet/create-partial-payment-for-sale/create-partial-payment-for-sale.component';

const routes: Routes = [
  { 
    path: '',
    component:  HomeComponent,
    children: [
      { path: '', redirectTo: 'inicio' },
      { path: 'inicio', component:  QuickStartComponent },
      { path: 'ventas/cotizacion', component:  QuotationComponent },
      { path: 'ventas', redirectTo: 'ventas/lista' },
      { path: 'ventas/nueva', component:  CreateSaleComponent },
      { path: 'ventas/lista', component:  SalesComponent },
      { path: 'ventas/cartera/crear', component:  CreatePartialPaymentComponent },
      { path: 'ventas/cartera/crear/:id', component:  CreatePartialPaymentForSaleComponent },
      { path: 'ventas/cartera', component:  SeeSalesComponent },
      { path: 'ventas/cartera/abonos/:id', component: EditPartialPaymentComponent },
      { path: 'ventas/cartera/:id', component: SeeSaleComponent },
      { path: 'ventas/:id', component:  EditSaleComponent },
      { path: 'proveedores/nuevo', component:  NewProviderComponent },
      { path: 'proveedores/lista', component:  ProvidersComponent },
      { path: 'proveedores', redirectTo: 'proveedores/lista' },
      { path: 'proveedores/:id', component: EditProviderComponent },
      { path: 'productos', redirectTo: 'productos/lista' },
      { path: 'productos/inventario', component:  StockComponent },
      { path: 'productos/nuevo', component:  NewProductComponent },
      { path: 'productos/lista', component:  ProductsListComponent },
      { path: 'productos/:id', component:  EditProductComponent },
      //{ path: 'categorias', component:  CategoriesComponent },
      { path: 'usuarios', redirectTo: 'usuarios/lista' },
      { path: 'usuarios/nuevo', component:  CreateUserComponent },
      { path: 'usuarios/lista', component:  UsersComponent },
      { path: 'usuarios/:id', component: EditUserComponent },
      { path: 'empresas', redirectTo: 'empresas/lista' },
      { path: 'empresas/nueva', component:  CreateCompanyComponent },
      { path: 'empresas/lista', component:  CompaniesComponent },
      { path: 'empresas/:id', component: EditCompanyComponent },
      { path: 'sucursales/nueva', component:  CreateBranchComponent },
      { path: 'sucursales/lista', component:  BranchOfficesComponent },
      { path: 'sucursales/:id', component: EditBranchComponent },
      { path: 'entradas/nueva', component:  CreateEntryComponent },
      { path: 'entradas/lista', component:  EntriesComponent },
      { path: 'entradas/ver/:id', component: SeeEntryComponent },
      { path: 'clientes', redirectTo: 'clientes/lista' },
      { path: 'clientes/nuevo', component:  CreateClientComponent },
      { path: 'clientes/lista', component:  ClientsComponent },
      { path: 'clientes/:id', component: EditClientComponent },
      { path: 'caja', redirectTo: 'caja/cierres' },
      { path: 'caja/cerrar', component:  CreateSquareComponent },
      { path: 'caja/cierres', component:  SquaresComponent },
      { path: 'caja/cierre/:id', component: EditSquareComponent },
      { path: 'gastos/registrar', component:  CreateOutputComponent },
      { path: 'gastos/lista', component:  OutputsComponent },
      { path: 'gastos/:id', component: EditOutputComponent },
      { path: 'reportes', component: ReportsComponent },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

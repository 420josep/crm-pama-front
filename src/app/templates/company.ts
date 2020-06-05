export interface PricingItem {
    id: number;
    name: string;
}

export interface Company {
    id: number;
    name: string;
    manager: string;
    contact: string;
    pricingID: number;
    creationDate: string;
    state: boolean;
}
  
export interface CompanyListItem {
    id: number;
    name: string;
    manager: string;
    usersNumber: number;
    pricing: string;
    creationDate: string;
    state: string;
}

export interface BranchOfficeListItem {
    id: number;
    name: string;
    usersNumber: number;
    company: string;
    city: string;
    creationDate: string;
    state: string;
}

export interface BranchOffice {
    id: number;
    name: string;
    companyID: number;
    countryID: number;
    provinceID: number;
    cityID: number;
    creationUser: number;
    creationDate: string;
    state: boolean;
}
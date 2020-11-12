export interface EntriesList {
    id: number;
    date: string;
    billNumber: number;
    total: number;
    provider: string;
    company: string;
    branch: string;
    creationUser: string;
}

export interface Entry {
    id: number;
    date: string;
    billNumber: number;
    total: number;
    branchID: number;
    providerID: number;
    products: ProductEntry[];
    companyID: number;
    company: string;
    creationUser: string;
}

export interface ProductEntry {
    id: number;
    productID: number;
    unitValue: number;
    quantity: number;
}
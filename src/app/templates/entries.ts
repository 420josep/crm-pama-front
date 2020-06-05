export interface EntriesList {
    id: number;
    date: string;
    billNumber: string;
    provider: string;
    company: string;
    branch: string;
}

export interface Entry {
    id: number;
    date: string;
    billNumber: string;
    provider: string;
    company: string;
    branch: string;
    creationUser: string;
    products: ProductEntry[];
}

export interface ProductEntry {
    product: string;
    quantity: number;
}
export interface PresentationType {
    id: number;
    description: string;
    abbreviated: string;
}

export interface ProductListItem {
    id: number;
    name: string;
    brand: string;
    content: string;
    price: number;
    company: string;
    creationUser: string;
    state: string;
}

export interface Product {
    id: number;
    name: string;
    brand: string;
    presentationID: number;
    content: string;
    price: number;
    companyID: number;
    creationDate: string;
    state: string;
}

export interface StockItem {
    name: string;
    brand: string;
    company: string;
    branch: string;
    stock: number;
}
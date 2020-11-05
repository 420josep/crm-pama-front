export interface ProductSaleItem {
    quantity: number;
    product: ProductSaleList;
}

export interface ProductSaleList {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface SaleList {
    id: number;
    date: string;
    billNumber: number;
    client: string;
    direction: string;
    phone: string;
    total: number;
    branch: string;
    company: string;
    status: string;
    statusID: number;
    payment: string;
    paymentID: number;
    creationUser: string;
}

export interface Sale {
    id: number;
    date: string;
    clientID: number;
    total: number;
    realTotal: number;
    billNumber: number;
    branchID: number;
    companyID: number;
    company: string;
    statusID: number;
    paymentID: number;
    observation: string;
    products: EditProductSale[];
}

export interface EditProductSale {
    id: number;
    product: string;
    productPrice: number;
    quantity: number;
}


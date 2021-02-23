export interface ProductSaleItem {
    quantity: number;
    product: ProductSaleList;
}

export interface ProductSaleList {
    id: number;
    name: string;
    price: number;
    stock: number;
    iva: boolean;
}

export interface SaleList {
    id: number;
    date: string;
    billNumber: number;
    client: string;
    direction: string;
    phone: string;
    useMobile: boolean;
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
    discountValue: number;
    ivaValue: number;
    products: EditProductSale[];
    partialPayments: PartialPaymentDescription[];
}

export interface EditProductSale {
    id: number;
    productID: number;
    product: string;
    productPrice: number;
    quantity: number;
    iva: boolean;
}

export interface PartialPaymentDescription {
    id: number;
    date: string;
    value: number;
    creationUser: string;
}

export interface PendingSaleList {
    id: number;
    date: string;
    billNumber: number;
    client: string;
    direction: string;
    phone: string;
    useMobile: boolean;
    total: number;
    branch: string;
    company: string;
    paymentID: number;
    payment: string;
    creationUser: string;
    totalPartialPayments: number;
    dateLastPartialPayment: string;
    valueLastPartialPayment: number;
    pendingToPay: number;
}

export interface PendingSaleItem {
    id: number;
    date: string;
    billNumber: number;
    client: string;
    total: number;
    pendingToPay: number;
}

export interface SaleForPartialPayments {
    date: string;
    billNumber: number;
    client: number;
    total: number;
    branch: string;
    company: string;
    payment: string;
    totalPartialPayments: number;
    pendingToPay: number;
    creationUser: string;
    partialPayments: PartialPaymentDescription[];
}


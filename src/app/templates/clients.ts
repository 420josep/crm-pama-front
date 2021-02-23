export interface ClientListItem {
    id: number;
    name: string;
    discount: number;
    direction: string;
    phone: string;
    company: string;
    state: string;
}

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    discount: number;
    direction: string;
    phone: string;
    useMobile: boolean;
    companyID: number;
    creationDate: string;
    state: boolean;
}

export interface ClientsList {
    id: number;
    name: string;
    discount: number;
}
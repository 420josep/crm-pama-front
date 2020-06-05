export interface Category {
    id: number;
    name: string;
    company: string;
    companyID: number;
    subcategories: Array<Subcategory>;
}

export interface Subcategory {
    id: number;
    name: string;
}
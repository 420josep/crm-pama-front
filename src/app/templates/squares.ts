export interface SquareList {
    id: number;
    date: string;
    totalSales: number;
    totalSalesMoney: number;
    totalOutputs: number;
    mismatch: number;
    branch: string;
    company: string;
}

export interface Square {
    id: number;
    date: string;
    initialMoney: number;
    cash: number;
    totalSalesMoney: number;
    totalSales: number;
    totalOutputs: number;
    mismatch: number;
    branch: string;
    company: string;
    observation: string;
    creationDate: string;
}
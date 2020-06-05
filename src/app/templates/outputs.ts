export interface OutputList {
    id: number;
    description: string;
    value: number;
    branch: string;
    company: string;
    creationUser: string;
    date: string;
}

export interface Output {
    id: number;
    description: string;
    value: number;
    branchID: number;
    companyID: number;
    company: string;
    date: string;
}
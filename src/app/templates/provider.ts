export interface Provider {
  id: number;
  name: string;
  nick: string;
  businessName: string;
  nit: string;
  manager: string;
  phone: string;
  description: string;
  companyID: number;
  state: boolean;
  creationDate: string;
}

export interface ProviderListItem {
  id: number;
  name: string;
  nick: string;
  manager: string;
  phone: string;
  creationUser: string;
  company: string;
  state: string;
}
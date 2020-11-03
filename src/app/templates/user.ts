export interface User {
  id: number;
  firstName: string;
  lastName: string;
  branchID: number;
  branch: string;
  companyID: number;
  company: string;
  dni: string;
  email: string;
  phone: string;
  username: string;
  creationDate: string;
  type: number;
  state: boolean;
  lastConnection: string;
}

export interface UserListItem {
  id: number;
  name: string;
  company: string;
  branch: string;
  city: string;
  username: string;
  type: string;
  lastConnection: string;
  state: string;
}
import type { DebtType } from "./Debt";

export interface DebtorType {
  id: string;
  fullname: string;
  address: string;
  note: string;
  star?: boolean;
  images: string[]; 
  phoneNumbers:{number:string}[]; 
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  Debt?: DebtType[];
}

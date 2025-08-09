import type { DebtType } from "./Debt";
import type { DebtorType } from "./Debtor";

export interface SellerType {
    id: string;
    name: string;
    phone: string;
    img: string;
    status: boolean;
    wallet: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    Debt: Array<DebtType>
    Debtor: Array<DebtorType>
    totalDebt: number;
    lateDebtors: number;
    lateDebtorsCount: number;
}
import type { DebtorType } from "./Debtor"

export interface UnpaidDayType {
    date: string
    debts: DebtItemType[]
    total: number
}

export interface DebtItemType {
    id: string
    productName: string
    startDate: string
    term: number
    note: string
    amount: number
    debtorId: string
    sellerId: string
    createdAt: string
    updatedAt: string
    Debtor: DebtorType
    paymentHistory?: {
        amount: number
        date: string
    }[]
}

// Kalendar uchun umumiy type
export interface CalendarType {
    unpaidForDay: UnpaidDayType[]
    totalForMonths: number
}

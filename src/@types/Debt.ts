export interface DebtType{
    id:string;
    name:string;
    startDate:string;
    term:string;
    note:string;
    total:number,
    debtorId:string;
    sellerId:string;
    createdAt:string;
    updatedAt:string
    paymentHistory:Array<{amount:number}>
    ImagesOfDebt:Array<{imege:string}>
}
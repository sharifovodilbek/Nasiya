export interface DebtorType {
    id: string;
    fullname: string;
    address: string;
    note: string;
    imageOfDebtor:Array<{image:string}>;
    phoneNumbers: { number: string }[]
    sellerId: string;   
    createdAt: string;
    updatedAt: string;
}   
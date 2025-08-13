import { instance } from "../hooks/instance";
import type { DebtorType } from "../@types/Debtor";

export type DebtorListItem = DebtorType & {
  totalDebt?: number;
  favorite?: boolean;
};

export async function fetchDebtors(query: string, token?: string) {
  const res = await instance.get(`/debtor?query=${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  return res.data.data.map((debtor: any) => ({
    ...debtor,
    phoneNumbers: debtor.NumberOfDebtor || [], 
  }));
}


export type CreateDebtorPayload = {
  fullname: string;
  phoneNumbers: { number: string }[];
  address: string;
  note?: string;
  star?: boolean;
  images: string[]; 
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file); 
  const res = await instance.post("/multer/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.path; 
}

export async function createDebtor(
  payload: Omit<CreateDebtorPayload, "images"> & { images?: (File | string)[] },
  token?: string
) {
  let uploadedUrls: string[] = [];

  if (payload.images?.length) {
    uploadedUrls = await Promise.all(
      payload.images.map(img =>
        typeof img === "string" ? Promise.resolve(img) : uploadImage(img)
      )
    );
  }

  const finalPayload = {
    fullname: payload.fullname,
    address: payload.address,
    note: payload.note ?? "",
    star: payload.star ?? false,
    phoneNumbers: payload.phoneNumbers?.map(p => p.number) || [],
    images: uploadedUrls
  };

  const res = await instance.post("/debtor", finalPayload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
}


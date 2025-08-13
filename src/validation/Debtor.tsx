import * as yup from "yup";

export const DebtorCreateSchema = yup.object({
  fullname: yup.string().required("Ism majburiy"),
  phones: yup
    .array()
    .of(
      yup.object({
        number: yup
          .string()
          .required("Telefon raqami majburiy")
          .matches(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, "Noto‘g‘ri format"),
      })
    )
    .min(1, "Kamida bitta telefon raqam kiriting"),
  address: yup.string().optional(),
  note: yup.string().optional(),
  images: yup.array().of(yup.mixed<File>()),
});

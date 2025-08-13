"use client"

import React, { useMemo, useRef, useState } from "react"
import { useFormik, type FormikHelpers } from "formik"
import { useNavigate } from "react-router-dom"
import { Button, Input, message } from "antd"
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react"
import { DebtorCreateSchema } from "../../validation/Debtor"
import { createDebtor } from "../../service/debtor"
import { useCookies } from "react-cookie"
import { PATH } from "../../hooks/Path"

type Preview = { id: string; file: File; url: string }

type FormValues = {
  fullname: string
  phones: { number: string }[]
  address: string
  note: string
}

export default function DebtorCreate() {
  const navigate = useNavigate()
  const [cookies] = useCookies(["accessToken"])
  const [previews, setPreviews] = useState<Preview[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)

  const formik = useFormik<FormValues>({
    initialValues: { fullname: "", phones: [{ number: "" }], address: "", note: "" },
    validationSchema: DebtorCreateSchema,
    onSubmit: async (vals, helpers: FormikHelpers<FormValues>) => {
      try {
        const payload = {
          fullname: vals.fullname.trim(),
          phoneNumbers: vals.phones.map(p => ({ number: p.number.trim() })),
          address: vals.address.trim(),
          note: vals.note?.trim(),
          star: false,
          images: previews.map(p => p.file)
        }

        await createDebtor(payload, cookies.accessToken)

        message.success("Mijoz yaratildi")
        navigate(PATH.debtors)
      } catch (err: any) {
        message.error(err?.message || "Yaratishda xatolik")
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting } = formik

  function addPhone() {
    setFieldValue("phones", [...values.phones, { number: "" }])
  }

  function removePhone(index: number) {
    setFieldValue("phones", values.phones.filter((_, i) => i !== index))
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const next = files.map(f => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
      url: URL.createObjectURL(f),
    }))
    setPreviews(p => [...p, ...next])
    if (fileRef.current) fileRef.current.value = ""
  }

  function removePreview(id: string) {
    setPreviews(p => {
      const prev = p.find(x => x.id === id)
      if (prev) URL.revokeObjectURL(prev.url)
      return p.filter(x => x.id !== id)
    })
  }

  const canSubmit = useMemo(() => {
    const hasName = values.fullname.trim().length > 0
    const hasPhone = values.phones.some(p => p.number.trim().length >= 7)
    return hasName && hasPhone && !isSubmitting
  }, [values, isSubmitting])

  return (
    <div className="containers pt-[12px] pb-[24px] flex flex-col gap-[14px]">
      <div className="flex items-center justify-between mb-[16px]">
        <button
          type="button"
          aria-label="Orqaga"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(PATH.debtors))}
          className="w-[32px] h-[32px] rounded-full bg-[#F2F4F7] flex items-center justify-center"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-[#111827]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111827]">Mijoz yaratish</h1>
        <div className="w-[32px]" />
      </div>

      <form id="debtor-create-form" onSubmit={handleSubmit} className="space-y-[24px]" autoComplete="off">
        <div className="space-y-[6px]">
          <label className="text-[12px] font-semibold text-[#111827]">Ismi *</label>
          <Input
            name="fullname"
            placeholder="Ismini kiriting"
            value={values.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`!h-[40px] !rounded-[10px] ${errors.fullname && touched.fullname ? "!border-red-400" : ""}`}
          />
          {errors.fullname && touched.fullname && (
            <p className="text-[12px] text-red-500">{errors.fullname}</p>
          )}
        </div>

        <div className="space-y-[6px]">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#111827]">Telefon raqami *</label>
            <button type="button" onClick={addPhone} className="text-[12px] text-[#3478F7] underline underline-offset-2">
              + Ko‘proq qo‘shish
            </button>
          </div>
          <div className="space-y-[8px]">
            {values.phones.map((_, i) => {
              const phoneError = (errors as any).phones?.[i]?.number
              const phoneTouched = (touched as any).phones?.[i]?.number
              return (
                <div key={i} className="flex items-center gap-[8px]">
                  <Input
                    name={`phones[${i}].number`}
                    placeholder="Telefon raqami"
                    value={values.phones[i].number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`!h-[40px] !rounded-[10px] ${phoneError && phoneTouched ? "!border-red-400" : ""}`}
                  />
                  {values.phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(i)}
                      aria-label="O‘chirish"
                      className="w-[36px] h-[36px] rounded-[10px] bg-[#F2F4F7] flex items-center justify-center"
                    >
                      <Trash2 className="w-[16px] h-[16px] text-[#111827]" />
                    </button>
                  )}
                  {phoneError && phoneTouched && <p className="text-[12px] text-red-500">{phoneError}</p>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-[6px]">
          <label className="text-[12px] font-semibold text-[#111827]">Yashash manzili</label>
          <Input
            name="address"
            placeholder="Yashash manzilini kiriting"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className="!h-[40px] !rounded-[10px]"
          />
        </div>

        <div className="space-y-[6px]">
          <label className="text-[12px] font-semibold text-[#111827]">Eslatma</label>
          <Input
            name="note"
            placeholder="Eslatma qo‘shish"
            value={values.note}
            onChange={handleChange}
            onBlur={handleBlur}
            className="!h-[40px] !rounded-[10px]"
          />
        </div>

        <div className="space-y-[8px]">
          <p className="text-[12px] font-semibold text-[#111827]">Rasm biriktirish</p>
          {previews.length === 0 ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-[140px] h-[92px] rounded-[12px] border border-[#ECECEC] bg-white flex flex-col items-center justify-center text-[#667085] gap-[6px]"
            >
              <ImagePlus className="w-[18px] h-[18px]" />
              <span className="text-[12px]">Rasm qo‘shish</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-[10px]">
              {previews.map(p => (
                <div key={p.id} className="relative w-[120px] h-[80px] rounded-[10px] overflow-hidden border border-[#ECECEC] bg-[#F6F6F6]">
                  <img src={p.url || "/placeholder.svg"} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-[6px] right-[6px] w-[24px] h-[24px] rounded-full bg-white shadow flex items-center justify-center"
                    onClick={() => removePreview(p.id)}
                    aria-label="Rasmni o‘chirish"
                  >
                    <Trash2 className="w-[14px] h-[14px] text-[#111827]" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-[120px] h-[80px] rounded-[10px] border border-dashed border-[#D0D5DD] text-[#667085] flex flex-col items-center justify-center"
              >
                <ImagePlus className="w-[18px] h-[18px]" />
                <span className="text-[12px] mt-[4px]">Yana qo‘shish</span>
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPickFiles} />
        </div>
      </form>

      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[400px] px-[16px] z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            htmlType="submit"
            form="debtor-create-form"
            loading={isSubmitting}
            disabled={!canSubmit}
            className={`w-full !h-[40px] !rounded-[10px] !text-[16px] ${!canSubmit ? "!bg-[#E5E7EB] !text-[#9CA3AF] !border-none" : ""}`}
            type="primary"
          >
            Saqlash
          </Button>
        </div>
      </div>
    </div>
  )
}

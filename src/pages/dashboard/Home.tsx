"use client"

import { Button } from "antd"
import Heading from "../../components/Heading"
import { EyeIcon, CalendarIcon, PlusIcon, WalletIcon } from "../../assets/icons"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { instance } from "../../hooks/instance"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { PATH } from "../../hooks/Path"
import type { SellerType } from "../../@types/SellerType"
import { API } from "../../hooks/getEnv"
import { FormatNumber } from "../../hooks/FormatNumber"

interface DebtorStatsType {
  sellerId: string
  lateDebtorsCount: number
  lateDebtors: any[]
}

const Home = () => {
  const [show, setShow] = useState<boolean>(true)
  const [cookie] = useCookies(["accessToken"])
  const navigate = useNavigate()

  const { data: sellerData } = useQuery<SellerType>({
    queryKey: ["get-seller"],
    queryFn: async () => {
      try {
        const res = await instance.get("seller/me", { headers: { Authorization: `Bearer ${cookie.accessToken}` } })
        if (res.data && res.data.data) {
          return res.data.data
        } else if (res.data) {
          return res.data
        }
        throw new Error("['get-seller'] data is undefined or malformed")
      } catch (err: any) {
        console.error("Seller data fetch error in queryFn:", err)
        throw new Error(err.response?.data?.message || err.message || "Failed to fetch seller data")
      }
    },
    enabled: !!cookie.accessToken,
  })

  const { data: debtorStatsData } = useQuery<DebtorStatsType>({
    queryKey: ["get-denied-payments-stats"],
    queryFn: async () => {
      try {
        const res = await instance.get("seller/denied-Payments", {
          headers: { Authorization: `Bearer ${cookie.accessToken}` },
        })
        if (res.data) {
          return res.data
        }
        throw new Error("['get-denied-payments-stats'] data is undefined or malformed")
      } catch (err: any) {
        console.error("Denied payments stats fetch error in queryFn:", err)
        throw new Error(err.response?.data?.message || err.message || "Failed to fetch denied payments data")
      }
    },
    enabled: !!cookie.accessToken,
  })

  const data = {
    name: sellerData?.name,
    img: sellerData?.img,
    totalDebt: sellerData?.totalDebt,
    wallet: sellerData?.wallet || "0",
    lateDebtors: debtorStatsData?.lateDebtors || [],
    lateDebtorsCount: debtorStatsData?.lateDebtorsCount || 0,
  }

  const isAbsolute = (u?: string) => !!u && /^https?:\/\//i.test(u)
  const imgSrc = (() => {
    const fallback = "profile-1754649248081-584037293.jpg"
    const img = data?.img
    if (isAbsolute(img)) return img as string
    if (img && API) {
      return `${(API as string).replace(/\/$/, "")}/${(img as string).replace(/^\//, "")}`
    }
    if (!img && API) {
      return `${(API as string).replace(/\/$/, "")}/${fallback}`
    }
    return "/placeholder.svg?height=40&width=40"
  })()

  return (
    <div className="containers !pt-[29px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[15px]">
          <img
            className="rounded-full"
            src={imgSrc || "/placeholder.svg"}
            alt="seller img"
            width={40}
            height={40}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=40&width=40"
            }}
          />
          <Heading tag="h2">{data?.name as any}</Heading>
        </div>
        <Button
          onClick={() => navigate(PATH.calendar)}
          aria-label="Kalendarga o'tish"
          className="!bg-[#EDEDED] !py-[11px] !px-[5px]"
        >
          <CalendarIcon />
        </Button>
      </div>

      <div className="bg-[#30AF49] text-white rounded-[20px] flex flex-col items-center justify-between py-[18px] relative mt-[38px]">
        <Heading classList="!text-[20px]" tag="h1">
          {show ? `${FormatNumber(data?.totalDebt || 0)} so‘m` : "****"}
        </Heading>
        <Heading tag="h3" classList="!text-[#F6F6F6B2]">
          Umumiy nasiya:
        </Heading>
        <button className="absolute right-[20px] top-[37px] cursor-pointer" onClick={() => setShow(!show)}>
          <EyeIcon />
        </button>
      </div>

      <div className="flex gap-[8px] mt-[31px]">
        <div className="p-[16px] rounded-[16px] border-[1px] border-[#ECECEC] w-full h-[127px] pr-[30px] flex flex-col justify-between">
          <Heading tag="h3">Kechiktirilgan to‘lovlar</Heading>
          <Heading tag="h2" classList="!text-[18px] !text-[#F94D4D]">
            {(data?.lateDebtors as any)?.length || 0}
          </Heading>
        </div>
        <div className="p-[16px] rounded-[16px] border-[1px] border-[#ECECEC] w-full h-[127px] pr-[30px] flex flex-col justify-between">
          <Heading tag="h3">Mijozlar soni</Heading>
          <Heading tag="h2" classList="!text-[18px] !text-[#30AF49]">
            {data?.lateDebtorsCount || 0}
          </Heading>
        </div>
      </div>

      <div className="mt-[40px]">
        <Heading tag="h3" classList="!text-[18px] mb-[26px]">
          Hamyoningiz
        </Heading>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="w-[48px] h-[48px] flex bg-[#735CD81A] rounded-full justify-center items-center">
              <WalletIcon />
            </div>
            <div className="space-y-[4px]">
              <p className="text-[13px] font-medium">Hisobingizda</p>
              <Heading tag="h1" classList="!text-[18px]">
                {FormatNumber(data?.wallet || 0)} so‘m
              </Heading>
            </div>
          </div>
          <Button type="primary" className="!px-[5px] !rounded-full">
            <PlusIcon />
          </Button>
        </div>

        <div className="flex justify-between mt-[28px]">
          <p className="text-[14px] font-medium">Bu oy uchun to‘lov:</p>
          <p className="text-[14px] font-semibold text-[#30AF49]">To‘lov qilingan</p>
        </div>
      </div>
    </div>
  )
}
export default Home

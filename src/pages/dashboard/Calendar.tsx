"use client"

import { useCookies } from "react-cookie"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomCalendar from "../../components/CustomCalendar"
import { instance } from "../../hooks/instance"
import { ArrowLeft } from "lucide-react"
import type { CalenderUniqForDayType } from "../../@types/CalendarDebt"
import { PATH } from "../../hooks/Path"

type CalendarQuery = {
  unpaidForDay: CalenderUniqForDayType[]
  totalForMonths: number
}

const CalendarPage = () => {
  const [cookies] = useCookies(["accessToken"])
  const [nowDate, setNowDate] = useState<dayjs.Dayjs | undefined>(dayjs())
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1)
    else navigate(PATH.main)
  }, [navigate])

  const { data } = useQuery<CalendarQuery>({
    queryKey: ["calendar-data", nowDate?.format("YYYY-MM")],
    queryFn: async () => {
      const month = nowDate?.format("YYYY-MM")
      const res = await instance.get(`debt/startDate?month=${month}`, {
        headers: { Authorization: `Bearer ${cookies.accessToken}` },
      })
      return res.data?.data ?? res.data
    },
    enabled: !!cookies.accessToken && !!nowDate,
  })

  return (
    <div className="containers pt-[10px] pb-[80px]">
      <div className="flex items-center justify-between mb-[16px]">
        <button
          type="button"
          aria-label="Orqaga"
          onClick={goBack}
          className="w-[32px] h-[32px] rounded-full bg-[#F2F4F7] flex items-center justify-center"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-[#111827]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111827]">Kalendar</h1>
        <div className="w-[32px]" />
      </div>

      <CustomCalendar
        newDate={nowDate}
        setNowDate={setNowDate}
        totalForMonth={data?.totalForMonths || 0}
        unpaidForDay={data?.unpaidForDay || []}
      />
    </div>
  )
}

export default CalendarPage

"use client"

import { useCookies } from "react-cookie"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomCalendar from "../../components/CustomCalendar"
import { instance } from "../../hooks/instance"
import { ArrowLeft } from "lucide-react"
import type { CalendarType, DebtItemType } from "../../@types/CalendarDebt"
import { PATH } from "../../hooks/Path"

const CalendarPage = () => {
  const [cookies] = useCookies(["accessToken"])
  const [nowDate, setNowDate] = useState<dayjs.Dayjs | undefined>(dayjs())
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1)
    else navigate(PATH.main)
  }, [navigate])

  const { data } = useQuery<CalendarType>({
    queryKey: ["calendar-data", nowDate?.format("YYYY-MM")],
    queryFn: async () => {
      if (!nowDate) return { unpaidForDay: [], totalForMonths: 0 }

      const currentMonth = nowDate.startOf("month") 
      const nextMonth = currentMonth.add(1, "month") 

      const res = await instance.get(`debt`, {
        headers: { Authorization: `Bearer ${cookies.accessToken}` },
      })

      const debts: DebtItemType[] = res.data.data || []

      function getTermMonths(term: number | string): number {
        if (typeof term === "number") {
          return term;
        }
        const match = term.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      }

      const filtered = debts.filter((item) => {
        const start = dayjs(item.startDate)
        const termMonths = getTermMonths(item.term)
        const end = start.add(termMonths, "month")

        return end.isAfter(currentMonth) && start.isBefore(nextMonth.endOf("month"))
      })

      const unpaidForDay = Object.values(
        filtered.reduce((acc: Record<string, any>, item) => {
          const startDate = dayjs(item.startDate);
          const termMonths = getTermMonths(item.term);
          let paymentDate: string | null = null;

          for (let i = 0; i < termMonths; i++) {
            const possibleDate = startDate.add(i, "month").format("YYYY-MM-DD");
            if (possibleDate.startsWith(currentMonth.format("YYYY-MM"))) {
              paymentDate = possibleDate;
              break;
            }
          }

          if (!paymentDate) {
            return acc;
          }

          if (!acc[paymentDate]) {
            acc[paymentDate] = {
              date: paymentDate,
              debts: [],
              total: 0,
            };
          }

          acc[paymentDate].debts.push(item);
          acc[paymentDate].total += (item.paymentHistory || []).reduce(
            (sum, pay) => sum + pay.amount,
            0
          );

          return acc;
        }, {})
      );


      const totalForMonths = unpaidForDay.reduce(
        (sum: number, day: any) => sum + day.total,
        0
      )

      return { unpaidForDay, totalForMonths }
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

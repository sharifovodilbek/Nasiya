"use client"
import dayjs from "dayjs"
import "dayjs/locale/uz"
import { Button } from "antd"
import Heading from "./Heading"
import Text from "./Text"
import { FindMonth } from "../hooks/FindMonth"
import { FormatNumber } from "../hooks/FormatNumber"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import type { UnpaidDayType } from "../@types/CalendarDebt"

dayjs.locale("uz")

type Props = {
  totalForMonth: number | string
  setNowDate: Dispatch<SetStateAction<dayjs.Dayjs | undefined>>
  newDate: dayjs.Dayjs | undefined
  unpaidForDay?: UnpaidDayType[]
}

type DayCell = {
  key: string
  inMonth: boolean
  date?: dayjs.Dayjs
}

const WEEKDAYS = ["DU", "SE", "CH", "PA", "JU", "SH", "YA"]

const toMonFirstIndex = (jsDay: number) => (jsDay + 6) % 7

export default function CustomCalendar({ newDate, setNowDate, totalForMonth, unpaidForDay = [] }: Props) {
  const current = newDate ?? dayjs()
  const startOfMonth = current.startOf("month")
  const endOfMonth = current.endOf("month")
  const daysInMonth = endOfMonth.date()

  const startCol = toMonFirstIndex(startOfMonth.day())

  const cells: DayCell[] = []
  for (let i = 0; i < startCol; i++) {
    cells.push({ key: `b-${i}`, inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = startOfMonth.date(d)
    cells.push({ key: `d-${d}`, inMonth: true, date })
  }
  while (cells.length < 42) {
    cells.push({ key: `t-${cells.length}`, inMonth: false })
  }

  const itemsByDay = unpaidForDay.reduce((map, item) => {
    const k = dayjs(item.date).format("YYYY-MM-DD")
    map.set(k, item)
    return map
  }, new Map<string, UnpaidDayType>())

  const selectedKey = current.format("YYYY-MM-DD")
  const selectedList = itemsByDay.get(selectedKey)?.debts || []

  function changeMonth(dir: "prev" | "next") {
    const next = dir === "next" ? current.add(1, "month") : current.subtract(1, "month")
    setNowDate(next)
  }

  return (
    <div className="w-full mt-5">
      <div className="flex items-center justify-between mt-[14px]">
        <Heading tag="h2" classList="!font-bold !text-[18px]">
          {FindMonth(current.month())}, {current.year()}
        </Heading>
        <div className="flex items-center gap-[8px]">
          <Button
            onClick={() => changeMonth("prev")}
            className="!w-[32px] !h-[32px] !p-0 !rounded-[12px] !bg-[#F2F4F7] !border-0"
          >
            <ChevronLeft className="!h-4 !w-4 text-[#6B7280]" />
          </Button>
          <Button
            onClick={() => changeMonth("next")}
            className="!w-[32px] !h-[32px] !p-0 !rounded-[12px] !bg-[#F2F4F7] !border-0"
          >
            <ChevronRight className="!h-4 !w-4 text-[#6B7280]" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between my-[10px]">
        <Text classList="!text-[12px] !text-[#667085] !font-medium">Oylik jami:</Text>
        <strong className="text-[14px] font-extrabold">
          {FormatNumber(totalForMonth)} <span className="font-normal">{"so'm"}</span>
        </strong>
      </div>

      <div className="grid grid-cols-7 gap-[6px] mb-[8px]">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[12px] font-semibold text-[#98A2B3] text-center">
            {d}
          </span>
        ))}
      </div>
      <div className="h-[1px] w-full bg-[#ECECEC] mb-[8px]" />

      <div className="grid grid-cols-7 gap-[6px]">
        {cells.map(({ key, inMonth, date }) => {
          if (!inMonth) {
            return <div key={key} className="w-[44px] h-[44px]" />
          }

          const isSelected = date!.isSame(current, "day")
          const k = date!.format("YYYY-MM-DD")
          const hasDot = itemsByDay.has(k)

          return (
            <button
              key={key}
              type="button"
              onClick={() => setNowDate(date)}
              className={[
                "relative flex flex-col justify-center items-center w-[44px] h-[44px] rounded-[12px] border font-semibold text-[13px]",
                isSelected
                  ? "text-[#78A5FA] border-[#78A5FA] bg-[#DDE9FE]"
                  : "text-[#111827] border-[#EDEDED] bg-[#F6F6F6] hover:border-[#D0D5DD]",
              ].join(" ")}
            >
              {hasDot && <span className="absolute left-[6px] top-[6px] w-[6px] h-[6px] rounded-full bg-[#30AF49]" />}
              <span>{String(date!.date()).padStart(2, "0")}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-[14px] rounded-[16px] bg-[#F6F6F6] px-[12px] py-[10px] mb-[10px]">
        <p className="text-[12px] font-semibold text-[#111827]">
          {current.date()} {FindMonth(current.month())} kuni to‘lov kutilmoqda
        </p>
      </div>

      <div className="space-y-[10px]">
        {selectedList.length > 0 ? (
          selectedList.map((item) => {
            console.log("Qarz item:", item)

            const totalAmount = item.paymentHistory?.reduce((sum, pay) => sum + pay.amount, 0) || 0

            return (
              <div
                key={item.id}
                className="p-[12px] rounded-[12px] bg-white text-[#111827] flex flex-col gap-[4px] shadow-[0_1px_0_rgba(0,0,0,0.04)] border border-[#ECECEC]"
              >
                <p className="text-[14px] font-medium">{item.Debtor?.fullname || "John Doe"}</p>
                <p className="text-[12px] text-[#667085]">UZS {FormatNumber(totalAmount)}</p>
              </div>
            )
          })
        ) : (
          <div className="text-[12px] text-[#98A2B3]">Bu kunda to‘lov kutilmaydi</div>
        )}
      </div>
    </div>
  )
}

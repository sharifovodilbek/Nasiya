"use client";

import { Input, Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
  Star,
  StarOff,
  Search,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormatNumber } from "../../hooks/FormatNumber";
import { PATH } from "../../hooks/Path";
import { fetchDebtors } from "../../service/debtor";
import type { DebtorType } from "../../@types/Debtor";

const FAVORITES_STORAGE_KEY = "debtor_favorites";

export default function DebtorsList() {
  const [cookies] = useCookies(["accessToken"]);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const navigate = useNavigate();


  const [localFav, setLocalFav] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isFetching } = useQuery<DebtorType[]>({
    queryKey: ["debtors", qDebounced],
    queryFn: () => fetchDebtors(qDebounced, cookies.accessToken),
  });

  useEffect(() => {
    if (data && Object.keys(localFav).length === 0) {
      const idToFav: Record<string, boolean> = {};
      data.forEach((d) => {
        idToFav[d.id] = !!d.star;
      });
      setLocalFav(idToFav);
    }
  }, [data, localFav]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(localFav));
    }
  }, [localFav]);

  const list = useMemo(() => {
    const arr = data || [];
    if (!q) return arr;
    const s = q.toLowerCase();
    return arr.filter((i) => {
      const fullNameMatch = i.fullname?.toLowerCase().includes(s) ?? false;
      const phoneMatch = (i.phoneNumbers ?? [])
        .map((p) => p.number || "")
        .join(", ")
        .toLowerCase()
        .includes(s);
      return fullNameMatch || phoneMatch;
    });
  }, [data, q]);

  function toggleFav(id: string) {
    setLocalFav((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (!data) return <div>Loading...</div>;
  console.log(data)

  return (
    <div className="containers pt-[30px] pb-[160px]">
      <div className="flex pt-[17px] items-center gap-[8px] mb-[14px]">
        <div className="flex-1 relative">
          <Search className="w-[16px] h-[16px] text-[#98A2B3] absolute left-[10px] top-1/2 -translate-y-1/2" />
          <Input
            allowClear
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mijozlarni qidirish..."
            className="!pl-[32px] !h-[40px] !rounded-[10px]"
          />
        </div>
        <button
          type="button"
          className="w-[40px] h-[40px] rounded-[10px] bg-[#F2F4F7] flex items-center justify-center"
          aria-label="Filterlar"
        >
          <SlidersHorizontal className="w-[18px] h-[18px] text-[#111827]" />
        </button>
      </div>

      <div className="space-y-[10px]">
        {(list || []).map((item) => {
          const totalDebt =
            item.Debt?.reduce((sum, debt) => sum + (debt.total || 0), 0) ?? 0;

          return (
            <div
              key={item.id}
              className="relative rounded-[12px] border border-[#ECECEC] bg-gray-100 p-[12px] pr-[44px]"
            >
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#111827]">
                  {item.fullname}
                </p>
                <p className="text-[12px] text-[#667085]">
                  {item.phoneNumbers?.[0]?.number || ""}
                </p>

                <p className="text-[12px] mt-[6px] flex items-center gap-[6px]">
                  <span className="text-[#98A2B3]">Jami nasiya:</span>
                  {totalDebt > 0 ? (
                    <span className="text-[#F94D4D] font-semibold">
                      {FormatNumber(totalDebt)} so‘m
                    </span>
                  ) : (
                    <span className="inline-block w-[12px] h-[2px] rounded-full bg-[#F94D4D]" />
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleFav(item.id)}
                aria-label={
                  localFav[item.id]
                    ? "Sevimlidan olib tashlash"
                    : "Sevimlilarga qo‘shish"
                }
                className="absolute top-[10px] right-[10px] flex items-center justify-center"
              >
                {localFav[item.id] ? (
                  <Star className="w-[18px] h-[18px] text-[#FFC107] fill-[#FFC107]" />
                ) : (
                  <StarOff className="w-[18px] h-[18px] text-[#98A2B3]" />
                )}
              </button>
            </div>
          );
        })}

        {!isFetching && list?.length === 0 && (
          <div className="text-center text-[13px] text-[#98A2B3] mt-[20px]">
            Mijoz topilmadi
          </div>
        )}
      </div>

      <div className="fixed pointer-events-none bottom-[100px] left-1/2 -translate-x-1/2 w-full max-w-[640px] px-[16px] z-50">
        <div className="flex justify-end  pointer-events-auto">
          <Button
            type="primary"
            onClick={() => navigate(PATH.debtorCreate)}
            className="!h-[44px] !rounded-[12px] flex items-center gap-[8px] !px-[14px]"
          >
            <Plus className="w-[18px] h-[18px]" />
            Yaratish
          </Button>
        </div>
      </div>
    </div>
  );
}

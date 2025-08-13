import { Route, Routes, Navigate } from "react-router-dom"
import DashboardLayout from "../../provider/DashboardLayout"
import { Suspense } from "react"
import { PageLoading } from "../../components"
import { Home } from "../../pages"
import CalendarPage from "../../pages/dashboard/Calendar"
import DebtorsList from "../../pages/debtors/List"
import DebtorCreate from "../../pages/debtors/Create"

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoading />}>
              <Home />
            </Suspense>
          }
        />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="debtors" element={<DebtorsList />} />
        <Route path="debtors/create" element={<DebtorCreate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

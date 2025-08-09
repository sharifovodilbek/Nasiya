import { Route, Routes } from "react-router-dom"
import { PATH } from "../../hooks/Path"
import { Home } from "../../pages"
import DashboardLayout from "../../provider/DashboardLayout"
import { Suspense } from "react"
import { PageLoading } from "../../components"
import CalendarPage from "../../pages/dashboard/Calendar"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path={PATH.main}
          element={
            <Suspense fallback={<PageLoading />}>
              <Home />
            </Suspense>
          }
        />
        <Route path={PATH.calendar} element={<CalendarPage />} />
      </Routes>
    </DashboardLayout>
  )
}
export default DashboardRoutes

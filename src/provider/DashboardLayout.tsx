import { Outlet } from "react-router-dom"
import { Menu } from "../modules"

export default function DashboardLayout() {
  return (
    <div className="h-[100vh] relative">
      <div className="pb-[76px]">
        <Outlet />
      </div>
      <Menu />
    </div>
  )
}

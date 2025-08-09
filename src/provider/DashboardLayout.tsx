import type { ReactNode } from "react"
import { Menu } from "../modules"

const DashboardLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="h-[100vh] relative">
      <div className="pb-[55px]">{children}</div>
      <Menu/>
    </div>
  )
}

export default DashboardLayout  
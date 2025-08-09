import { ClientsIcon, HomeIcon, ReportIcon, SettingsIcon } from "../assets/icons"
import MenuItem from "../components/MenuItem"

const Menu = () => {
  return (
    <div className="border-t-[1px] fixed bg-white z-50 w-full bottom-0 border-0 border-[]">
      <div className="containers">
        <div className="flex justify-between">
          <MenuItem to="/" title="Asosiy" icon={<HomeIcon className="!mx-auto !mb-[2px]" />} />
          <MenuItem to="/debtors" title="Mijozlar" icon={<ClientsIcon className="!mx-auto !mb-[2px]" />} />
          <MenuItem to="/report" title="Hisobot" icon={<ReportIcon className="!mx-auto !mb-[2px]" />} />
          <MenuItem to="/settings" title="Sozlama" icon={<SettingsIcon className="!mx-auto !mb-[2px]" />} />
        </div>
      </div>
    </div>
  )
}
export default Menu

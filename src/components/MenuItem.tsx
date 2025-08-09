import type { ReactNode, FC } from "react";
import { NavLink } from "react-router-dom";
import Text from "./Text";

type MenuItemProps = {
  icon: ReactNode;
  title: string;
  to: string;
};

const MenuItem: FC<MenuItemProps> = ({ icon, title, to }) => {
  return (
    <NavLink
      to={to}
      className="w-[25%] text-[#637D92] cursor-pointer py-[9.5px] text-center"
    >
      {icon}
      <Text classList="!text-[10px] !font-normal">{title}</Text>
    </NavLink>
  );
};

export default MenuItem;

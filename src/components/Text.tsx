import type { FC, ReactNode } from "react";

type TextProps = {
  classList?: string;
  children: ReactNode;
};

const Text: FC<TextProps> = ({ classList = "", children }) => {
  return <p className={`${classList} font-medium text-[16px]`}>{children}</p>;
};

export default Text;

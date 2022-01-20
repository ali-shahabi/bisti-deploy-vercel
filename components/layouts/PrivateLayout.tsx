import React, { FC } from "react";

const PrivateLayout: FC = ({ children }) => {
  return <div className="p-4 h-[100vh]">{children}</div>;
};

export default PrivateLayout;

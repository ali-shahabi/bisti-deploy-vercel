import React, { InputHTMLAttributes } from "react";

const Option = (props: InputHTMLAttributes<HTMLOptionElement>) => {
  return <option {...props}>{props.children}</option>;
};

export default Option;

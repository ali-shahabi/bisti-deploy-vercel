import React, { InputHTMLAttributes } from "react";

const Select = (props: InputHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 focusbg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      aria-label="Default select example"
      {...props}
    >
      {props.children}
    </select>
  );
};

export default Select;

import React, { InputHTMLAttributes } from "react";

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="relative w-full p-2 text-left rounded border border-solid border-gray-300  cursor-default focus:outline-none transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 "
      {...props}
    />
  );
};

export default Input;

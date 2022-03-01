import React from "react";
const MainInput = (props) => {
  return (
    <React.Fragment>
      <input
        className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-blue-500 focus:outline-none"
        type={props.type}
        name={props.name}
        maxLength={props.maxLength}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyPress}
        placeholder={props.placeholder}
        disabled={props.disabled}
        min={props.min}
      />
    </React.Fragment>
  );
};
export default MainInput;

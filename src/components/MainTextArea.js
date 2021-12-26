import React from "react";
const MainTextArea = (props) => {
  return (
    <React.Fragment>
      <textarea
        className={`${props.className} block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-blue-500 focus:outline-none`}
        type={props.type}
        maxLength={props.max}
        name={props.name}
        onChange={props.onChange}
        defaultValue={props.value}
      />
    </React.Fragment>
  );
};
export default MainTextArea;

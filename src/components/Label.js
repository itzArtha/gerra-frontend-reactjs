import React from "react";
const Label = (props) => {
  return (
    <React.Fragment>
      <label
        className={`${props.className} block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200`}
      >
        {props.label}
      </label>
    </React.Fragment>
  );
};
export default Label;

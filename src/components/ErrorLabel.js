import React from "react";
const ErrorLabel = (props) => {
  return (
    <React.Fragment>
      <p className={`${props.className} text-red-600 text-xs pt-1`}>
        {props.label}
      </p>
    </React.Fragment>
  );
};
export default ErrorLabel;

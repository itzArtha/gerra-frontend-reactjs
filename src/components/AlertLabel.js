import React from "react";
const AlertLabel = (props) => {
  return (
    <React.Fragment>
      <p className={`${props.className} text-xs pt-1`}>{props.label}</p>
    </React.Fragment>
  );
};
export default AlertLabel;

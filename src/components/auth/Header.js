import React from "react";

const Header = (props) => {
  return (
    <React.Fragment>
      <div className="pt-4 lg:pt-24 text-center">
        <img
          className="mx-auto w-48"
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Logo"
        />
        <h3 className="font-semibold">{props.title}</h3>
      </div>
    </React.Fragment>
  );
};
export default Header;

import React from "react";
const Footer = () => {
  return (
    <React.Fragment>
      <h4 className="font-semibold text-center pt-12 lg:pt-48 pb-8">
        Copyright {new Date().getFullYear()} | An Artha's Production
      </h4>
    </React.Fragment>
  );
};
export default Footer;

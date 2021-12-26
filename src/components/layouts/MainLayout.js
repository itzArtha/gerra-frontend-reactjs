import React from "react";
import TopNav from "./TopNav";
import Footer from "./Footer";
const MainLayout = (props) => {
  return (
    <React.Fragment>
      {props.top ? <TopNav /> : ""}
      {props.children}
      {props.footer ? <Footer /> : ""}
    </React.Fragment>
  );
};

export default MainLayout;

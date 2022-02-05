import React from "react";
import TopNav from "./TopNav";
import Footer from "./Footer";
import Menu from "../views/user/components/Menu";
const MainLayout = (props) => {
  return (
    <React.Fragment>
      {props.top ? <TopNav /> : ""}
      {props.children}
      {props.menu ? <Menu /> : ""}
      {props.footer ? <Footer /> : ""}
    </React.Fragment>
  );
};

export default MainLayout;

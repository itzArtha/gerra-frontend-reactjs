import React from "react";
import Layout from "./Layout";
import Header from "./Header";
import Footer from "./Footer";
import MainBox from "../MainBox";
import { Link, Redirect } from "react-router-dom";

const OnBoarding = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  if (isLoggedIn && role) {
    return <Redirect to={role === "1" ? "/" : "/complete-profile"} />;
  }
  return (
    <Layout>
      <React.Fragment>
        <Header title="Pilih salah satu untuk melanjutkan" />
        <div className="p-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 lg:mx-24">
          <Link to="user/login">
            <MainBox>Login sebagai pengguna</MainBox>
          </Link>
          <Link to="organization/login">
            <MainBox>Login sebagai organisasi</MainBox>
          </Link>
        </div>
        <Footer />
      </React.Fragment>
    </Layout>
  );
};
export default OnBoarding;

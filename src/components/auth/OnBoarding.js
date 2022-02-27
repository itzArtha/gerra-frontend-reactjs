import React, {useEffect} from "react";
import Layout from "./Layout";
import Header from "./Header";
import Footer from "./Footer";
import MainBox from "../MainBox";
import {Link, Redirect, useHistory} from "react-router-dom";
import isAuth from "../services/isAuth";

const OnBoarding = ({callback}) => {
    useEffect(() => {
        isAuth();
    }, []);
    const history = useHistory()
    const path = window.location.pathname;

    return (<Layout>
        <React.Fragment>
            <Header className={path === "/login" ? `pt-4 lg:pt-24 m-12` : ``} title="Pilih salah satu untuk melanjutkan"/>
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
                <MainBox onClick={() => {
                    path === "/login" ? history.push("/user/login") : callback("login", "user")
                }}>Login sebagai pengguna</MainBox>
                <MainBox onClick={() => {
                    path === "/login" ? history.push("/organization/login") : callback("login", "organization")
                }}>Login sebagai organisasi</MainBox>
            </div>
        </React.Fragment>
    </Layout>);
};
export default OnBoarding;

import React, {useEffect, useState} from "react";
import apiClient from "../services/apiClient";
import {useParams, Link, Redirect, useHistory} from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import SecBtn from "../SecondaryButton";
import GoogleBtn from "../GoogleLoginButton";
import isAuth from "../services/isAuth";

const Register = ({id, callback}) => {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        isNameError: false,
        nameErrorLabel: "",
        email: "",
        isEmailError: false,
        emailErrorLabel: "",
        password: "",
        isPasswordError: false,
        passwordErrorLabel: "",
        password_confirmation: "",
        isPassword_confirmationError: false,
        password_confirmationErrorLabel: "",
    });

    useEffect(() => {
        isAuth();
    }, []);

    const {id_params} = useParams();

    const path = window.location.pathname;

    if (["/user/register", "/organization/register"].includes(path)) {
        id = id_params;
        if (!["user", "organization"].includes(id_params)) {
            return <Redirect to="/login"/>;
        }
    }

    const loginHandler = async () => {
        setLoading(true);
        apiClient.get("/sanctum/csrf-cookie").then((response) => {
            apiClient
                .post("/api/v1/register", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    roles: id === "user" ? 1 : 0,
                })
                .then((response) => {
                    if (response.status === 200) {
                        apiClient
                            .post("/api/v1/login", {
                                email: formData.email, password: formData.password, roles: id === "user" ? 1 : 0,
                            })
                            .then((response) => {
                                setLoading(false);
                                if (response.status === 200) {

                                    return (["/user/register", "/organization/register"].includes(path)) ? history.push(id === "user" ? "/" : "/complete-profile") : window.location.reload()
                                }
                            });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    if (error.response.status === 401) {
                        setformData({
                            ...formData, isNameError: true, emailErrorLabel: error.response.data.message,
                        });
                    } else {
                        setformData({
                            ...formData, isNameError: true, emailErrorLabel: error.response.data.message,
                        });
                    }
                });
        });
    };

    const loginGoogle = async () => {
        setLoading(true);
        await apiClient.get("/sanctum/csrf-cookie").then((response) => {
            apiClient.get("/api/v1/auth/google").then((response) => {
                return (window.location.href = response.data);
            });
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.email && formData.password && formData.name) {
            setformData({
                ...formData, isNameError: false,
            });
            await loginHandler();
        } else if (!formData.name) {
            setformData({
                ...formData, isNameError: true, nameErrorLabel: "Nama tidak boleh kosong",
            });
        } else if (!formData.email) {
            setformData({
                ...formData, isEmailError: true, emailErrorLabel: "Email tidak boleh kosong",
            });
        } else if (!formData.password) {
            setformData({
                ...formData, isPasswordError: true, passwordErrorLabel: "Password tidak boleh kosong",
            });
        }
    };
    return (<Layout>
        <React.Fragment>
            <div className={["/user/register", "/organization/register"].includes(path) ? `pt-20 md:pt-36` : ``}>
                <div
                    className={["/user/register", "/organization/register"].includes(path) ? `flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-1/2` : ``}>

                    <div className="w-full px-6 py-8 md:px-8">
                        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
                            Daftar Sebagai {id === "user" ? "Pengguna" : "Organisasi"}
                        </h2>

                        <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                            "Kangguang geginane buka nyampat"
                        </div>
                        {/*
                    <GoogleBtn
                        type="button"
                        label={isLoading ? `Loading...` : `Masuk dengan Google`}
                        disabled={isLoading}
                        onClick={() => {
                            loginGoogle();
                        }}
                    />
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"/>

                        <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                            or register with email
                        </div>

                        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"/>
                    </div>*/}
                        <form onSubmit={handleRegister} method="post">
                            <div className="pt-4">
                                <Label label="Name"/>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setformData({
                                        ...formData, name: e.target.value, isNameError: false,
                                    })}
                                    name="name"
                                    type="text"
                                />
                                {formData.isNameError ? (<ErrorLabel label={formData.nameErrorLabel}/>) : ("")}
                            </div>

                            <div className="pt-4">
                                <Label label="Email Address"/>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setformData({
                                        ...formData, email: e.target.value, isEmailError: false,
                                    })}
                                    name="email"
                                    type="email"
                                />
                                {formData.isEmailError ? (<ErrorLabel label={formData.emailErrorLabel}/>) : ("")}
                            </div>

                            <div className="mt-4">
                                <Label label="Password"/>
                                <Input
                                    maxLength={30}
                                    value={formData.password}
                                    onChange={(e) => setformData({
                                        ...formData, password: e.target.value, isPasswordError: false,
                                    })}
                                    name="password"
                                    type="password"
                                />
                                {formData.isPasswordError ? (<ErrorLabel label={formData.passwordErrorLabel}/>) : ("")}
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-2">
                                <SecBtn
                                    type="button"
                                    label="Kembali"
                                    disabled={isLoading}
                                    onClick={() => {
                                        ["/user/register", "/organization/register"].includes(path) ? history.push("/" + id + "/login") : callback("")
                                    }}
                                />
                                <MainBtn
                                    type="submit"
                                    disabled={isLoading}
                                    label={isLoading ? "Loading.." : "Daftar"}
                                />
                            </div>
                        </form>
                        <div className="flex items-center justify-between mt-4">
                            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"/>

                            <p onClick={() => {
                                ["/user/register", "/organization/register"].includes(path) ? history.push("/" + id + "/login") : callback("")
                            }}
                               className="text-xs cursor-pointer text-gray-500 uppercase dark:text-gray-400 hover:underline">
                                or sign in
                            </p>

                            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    </Layout>);
};
export default Register;

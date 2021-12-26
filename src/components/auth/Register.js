import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { useParams, Link, Redirect, useHistory } from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import SecBtn from "../SecondaryButton";
import GoogleBtn from "../GoogleLoginButton";

const Register = () => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);
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
  const { id } = useParams();
  if (!["user", "organization"].includes(id)) {
    return <Redirect to="/login" />;
  }
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  if ((isLoggedIn && role) || redirect) {
    return (
      <Redirect
        to={id === "user" || role === "1" ? "/" : "/complete-profile"}
      />
    );
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
                email: formData.email,
                password: formData.password,
                roles: id === "user" ? 1 : 0,
              })
              .then((response) => {
                setLoading(false);
                if (response.status === 200) {
                  localStorage.setItem("isLoggedIn", true);
                  localStorage.setItem("role", id === "user" ? 1 : 0);
                  setRedirect(true);
                }
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 401) {
            setformData({
              ...formData,
              isNameError: true,
              emailErrorLabel: error.response.data.message,
            });
          } else {
            setformData({
              ...formData,
              isNameError: true,
              emailErrorLabel: error.response.data.message,
            });
          }
        });
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      formData.email &&
      formData.password &&
      formData.name &&
      formData.password === formData.password_confirmation
    ) {
      setformData({
        ...formData,
        isNameError: false,
      });
      await loginHandler();
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Nama tidak boleh kosong",
      });
    } else if (!formData.email) {
      setformData({
        ...formData,
        isEmailError: true,
        emailErrorLabel: "Email tidak boleh kosong",
      });
    } else if (!formData.password) {
      setformData({
        ...formData,
        isPasswordError: true,
        passwordErrorLabel: "Password tidak boleh kosong",
      });
    } else if (formData.password !== formData.password_confirmation) {
      setformData({
        ...formData,
        isPassword_confirmationError: true,
        password_confirmationErrorLabel: "Konfirmasi password tidak sama",
      });
    }
  };
  return (
    <Layout>
      <React.Fragment>
        <div className="pt-2 md:pt-36">
          <div className="flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-1/2">
            <div className="w-full px-6 py-8 md:px-8">
              <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
                Daftar Sebagai {id === "user" ? "Pengguna" : "Organisasi"}
              </h2>

              <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                "Kangguang geginane buka nyampat"
              </div>

              <GoogleBtn
                type="button"
                label="Masuk dengan Google"
                disabled={isLoading}
                onClick={() => {
                  console.log("OK");
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

                <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                  or register with email
                </div>

                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
              </div>
              <form onSubmit={handleRegister} method="post">
                <div className="pt-4">
                  <Label label="Name" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        name: e.target.value,
                        isNameError: false,
                      })
                    }
                    name="name"
                    type="text"
                  />
                  {formData.isNameError ? (
                    <ErrorLabel label={formData.nameErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="pt-4">
                  <Label label="Email Address" />
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        email: e.target.value,
                        isEmailError: false,
                      })
                    }
                    name="email"
                    type="email"
                  />
                  {formData.isEmailError ? (
                    <ErrorLabel label={formData.emailErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-4">
                  <Label label="Password" />
                  <Input
                    value={formData.password}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        password: e.target.value,
                        isPasswordError: false,
                      })
                    }
                    name="password"
                    type="password"
                  />
                  {formData.isPasswordError ? (
                    <ErrorLabel label={formData.passwordErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-4">
                  <Label label="Konfirmasi Password" />
                  <Input
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        password_confirmation: e.target.value,
                        isPassword_confirmationError: false,
                      })
                    }
                    name="password"
                    type="password"
                  />
                  {formData.isPassword_confirmationError ? (
                    <ErrorLabel
                      label={formData.password_confirmationErrorLabel}
                    />
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2">
                  <SecBtn
                    type="button"
                    label="Kembali"
                    disabled={isLoading}
                    onClick={() => {
                      history.push("/login");
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
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                <Link to="login">
                  <p className="text-xs cursor-pointer text-gray-500 uppercase dark:text-gray-400 hover:underline">
                    or sign in
                  </p>
                </Link>
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Layout>
  );
};
export default Register;

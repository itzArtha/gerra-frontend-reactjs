import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useParams, Link, Redirect, useHistory } from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import SecBtn from "../SecondaryButton";
import GoogleBtn from "../GoogleLoginButton";
import AlertModal from "../modals/AlertModal";
import isAuth from "../services/isAuth";

const Login = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    isEmailError: false,
    emailErrorLabel: "",
    password: "",
    isPasswordError: false,
    passwordErrorLabel: "",
  });

  useEffect(() => {
    isAuth();
  }, []);

  const { id } = useParams();
  if (!["user", "organization"].includes(id)) {
    return <Redirect to="/login" />;
  }

  const loginHandler = async () => {
    setLoading(true);
    await apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient
        .post("/api/v1/login", {
          email: formData.email,
          password: formData.password,
          roles: id === "user" ? 1 : 0,
        })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            return history.push(id === "user" ? "/" : "/complete-profile");
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 401) {
            setformData({
              ...formData,
              isEmailError: true,
              emailErrorLabel: error.response.data.message,
            });
          } else {
            setShowModal(true);
          }
        });
    });
  };

  const loginGoogle = async () => {
    setLoading(true);
    await apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient.get("/api/v1/auth/google").then((response) => {
        window.location.href = response.data;
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setformData({
        ...formData,
        isEmailError: false,
      });
      await loginHandler();
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
    }
  };
  return (
    <Layout>
      <React.Fragment>
        <AlertModal
          showModal={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
          text={"Error gais, bentaran yak aksesnya. Mwahh :*"}
          button={true}
          image={process.env.PUBLIC_URL + "/broken-heart.svg"}
        />
        <div className="pt-20 md:pt-36">
          <div className="flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-1/2">
            <div className="w-full px-6 py-8 md:px-8">
              <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
                Login Sebagai {id === "user" ? "Pengguna" : "Organisasi"}
              </h2>

              <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                "Kangguang geginane buka nyampat"
              </div>

              <GoogleBtn
                type="button"
                label={isLoading ? `Loading...` : `Masuk dengan Google`}
                disabled={isLoading}
                onClick={() => {
                  loginGoogle();
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

                <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                  or login with email
                </div>

                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
              </div>
              <form onSubmit={handleSubmit} method="post">
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
                  <div className="flex justify-between">
                    <Label label="Password" />
                    <Link to="/forget-password">
                      <div className="text-xs cursor-pointer text-gray-500 dark:text-gray-300 hover:underline">
                        Forget Password?
                      </div>
                    </Link>
                  </div>

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
                    label={isLoading ? "Loading.." : "Login"}
                  />
                </div>
              </form>
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                <Link to="register">
                  <p className="text-xs cursor-pointer text-gray-500 uppercase dark:text-gray-400 hover:underline">
                    or sign up
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
export default Login;

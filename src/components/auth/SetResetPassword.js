import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { useHistory, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import Image from "../../logo.svg";
import AlertModal from "../modals/AlertModal";
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const SetResetPassword = () => {
  const history = useHistory();
  const [complete, setComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formData, setformData] = useState({
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
  let query = useQuery();
  const sendLinkHandler = async () => {
    setLoading(true);
    await apiClient
      .post("/api/v1/password/reset", {
        email: formData.email,
        token: query.get("token"),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setComplete(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setformData({
            ...formData,
            isPasswordError: true,
            passwordErrorLabel: error.response.data.message,
          });
        } else {
          setShowModal(true);
        }
        setLoading(false);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation
    ) {
      setformData({
        ...formData,
        isPasswordError: false,
      });
      await sendLinkHandler();
    } else if (!formData.password) {
      setformData({
        ...formData,
        isPasswordError: true,
        passwordErrorLabel: "Password gak boleh kosong, anj",
      });
    } else if (!formData.password_confirmation) {
      setformData({
        ...formData,
        isPassword_confirmationError: true,
        password_confirmationErrorLabel: "Dibilangin ga boleh kosong!",
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
          image={Image}
        />
        <div className="pt-36">
          <div className="flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-1/2">
            <div className="w-full px-6 py-8 md:px-8">
              <img
                className="w-36 h-36 m-auto"
                src={
                  process.env.PUBLIC_URL +
                  (complete ? "/checked.svg" : "/warrior.svg")
                }
                alt="Icon"
              />
              <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-white uppercase">
                {complete ? "Sukses Mengganti Password" : "Ganti Password"}
              </h2>
              {!complete && (
                <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                  Silakan ganti passwordmu disini ya kawand
                </div>
              )}
              <form onSubmit={handleSubmit} method="post">
                {!complete && (
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <Label label="Email" />
                    </div>
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
                )}
                {!complete && (
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <Label label="Password" />
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
                )}
                {!complete && (
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <Label label="Konfirmasi Password" />
                    </div>
                    <Input
                      value={formData.password_confirmation}
                      onChange={(e) =>
                        setformData({
                          ...formData,
                          password_confirmation: e.target.value,
                          isPassword_confirmationError: false,
                        })
                      }
                      name="password_confirmation"
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
                )}

                <div className="mt-8 w-full">
                  {complete ? (
                    <MainBtn
                      className="w-full"
                      type="button"
                      onClick={() => {
                        history.push("/");
                      }}
                      disabled={isLoading}
                      label={"Ok"}
                    />
                  ) : (
                    <MainBtn
                      className="w-full"
                      type="submit"
                      disabled={isLoading}
                      label={isLoading ? "Menyimpan..." : "Simpan"}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Layout>
  );
};
export default SetResetPassword;

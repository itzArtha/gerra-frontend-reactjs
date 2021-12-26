import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import SecBtn from "../SecondaryButton";
import AlertModal from "../modals/AlertModal";

const ResetPassword = () => {
  const history = useHistory();
  const [complete, setComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    isEmailError: false,
    emailErrorLabel: "",
  });
  const sendLinkHandler = async () => {
    setLoading(true);
    await apiClient
      .post("/api/v1/forget-password", {
        email: formData.email,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setComplete(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setformData({
            ...formData,
            isEmailError: true,
            emailErrorLabel: error.response.data.message,
          });
        } else {
          setShowModal(true);
        }
        setLoading(false);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email) {
      setformData({
        ...formData,
        isEmailError: false,
      });
      await sendLinkHandler();
    } else {
      setformData({
        ...formData,
        isEmailError: true,
        emailErrorLabel: "Email tidak boleh kosong, anj",
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
        <div className="pt-12 md:pt-36">
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
                {complete
                  ? "Sukses Mengirim Link Reset Password"
                  : "Kirim Link Reset Password"}
              </h2>
              {!complete && (
                <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                  Silakan klik kirim link di bawah lalu klik link yang kami
                  kirim lewat email
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

                <div className="mt-8 grid grid-cols-3 gap-2">
                  <SecBtn
                    type="button"
                    label="Kembali"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => {
                      history.push("/login");
                    }}
                  />
                  {complete ? (
                    <MainBtn
                      className="w-full col-span-2"
                      type="button"
                      onClick={() => {
                        setComplete(false);
                      }}
                      disabled={isLoading}
                      label={"Kirim Ulang Link"}
                    />
                  ) : (
                    <MainBtn
                      className="w-full col-span-2"
                      type="submit"
                      disabled={isLoading}
                      label={isLoading ? "Mengirim..." : "Kirim Link"}
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
export default ResetPassword;

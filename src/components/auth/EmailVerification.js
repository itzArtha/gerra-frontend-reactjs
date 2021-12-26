import React, { useState } from "react";
import apiClient from "../services/apiClient";
import Layout from "./Layout";
import MainBtn from "../MainButton";
import AlertModal from "../modals/AlertModal";

const EmailVerification = () => {
  const [complete, setComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const sendLinkHandler = async () => {
    setLoading(true);
    await apiClient
      .get("/api/v1/email/resend")
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setComplete(true);
        }
      })
      .catch((error) => {
        setShowModal(true);
        setLoading(false);
      });
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
                  ? "Sukses Mengirim Link Verifikasi"
                  : "VERIFIKASI EMAILMU DULU KAWAND"}
              </h2>
              {!complete && (
                <div className="text-sm text-center text-gray-600 dark:text-gray-200 py-4">
                  Silakan klik kirim link di bawah lalu klik link yang kami
                  kirim lewat email
                </div>
              )}
              <div className="mt-8">
                {complete ? (
                  <MainBtn
                    className="w-full"
                    type="button"
                    onClick={() => {
                      setComplete(false);
                    }}
                    disabled={isLoading}
                    label={"Kirim Ulang Link"}
                  />
                ) : (
                  <MainBtn
                    className="w-full"
                    type="button"
                    onClick={() => {
                      sendLinkHandler();
                    }}
                    disabled={isLoading}
                    label={isLoading ? "Mengirim..." : "Kirim Link"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Layout>
  );
};
export default EmailVerification;

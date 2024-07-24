import SecondaryButton from "../../../SecondaryButton";
import MainButton from "../../../MainButton";
import React, { useCallback, useEffect, useState } from "react";
import InfoModal from "../../../modals/InfoModal";
import apiClient from "../../../services/apiClient";
import CurrencyFormat from "react-currency-format";
import Skeleton from "../../../Skeleton";
import ErrorLabel from "../../../ErrorLabel";
import { useHistory } from "react-router-dom";
import Label from "../../../Label";
import Input from "../../../MainInput";
import MainTextArea from "../../../MainTextArea";
import isAuth from "../../../services/isAuth";
import LoginModal from "../../../modals/LoginModal";
import Register from "../../../auth/Register";
import Login from "../../../auth/Login";
import OnBoarding from "../../../auth/OnBoarding";
import handleSwal from "../../../handleSwal";
import Countdown from "react-countdown";
import moment from "moment";
const PaymentMethod = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [total, setTotal] = useState({
    total: 0,
    newTotal: 0,
  });
  const [data, setData] = useState({});
  const [notes, setNotes] = useState("");
  const [pm, setPM] = useState("");
  const [isPmError, setPMError] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setLogin] = useState(false);
  const [LoginType, setLoginType] = useState("");
  const [expired, setExpired] = useState(moment().add(90000).format());
  const history = useHistory();

  const handlePaymentMethod = (data) => {
    setPMError(false);
    setPM(data);
    setShowModal(false);
  };

  useEffect(() => {
    const handleFetchData = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/user/checkout/data")
        .then((response) => {
          response = response.data;
          setData(response.data);
          setTotal({
            total: response.data.total,
          });
          setExpired(response.expired_at);

          setLoggedIn(response.isLoggedIn);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            history.push("/");
          }
        });
      setLoading(false);
    };

    handleFetchData();
  }, []);

  const swicthPM = (data) => {
    switch (data) {
      case "RETAIL":
        return "Alfamart";

      case "E_WALLET":
        return "eWallet";

      case "VA":
        return "Virtual Account";

      default:
        return data;
    }
  };

  const handlePayment = async () => {
    if (pm) {
      setPayLoading(true);
      await apiClient
        .post("/api/v1/user/payment/pay", {
          payment_method: pm,
          notes: notes,
        })
        .then((response) => {
          if (response.status === 200) {
            history.push("payment?ref_id=" + response.data);
            window.location.href = response.data;
          }
        })
        .catch((error) => {
          handleSwal(error.response.data.message, "error");
        });
      setPayLoading(false);
    } else if (!pm) {
      setPMError(true);
    }
  };

  const callback = useCallback((type, id) => {
    setLoginType(type);
  }, []);

  const countDownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      window.location.href = "/";
    } else {
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <>
      <InfoModal
        showModal={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        title={"Pilih Metode Pembayaran"}
      >
        <div>
          <div
            onClick={() => {
              handlePaymentMethod("VA");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black"
          >
            <span>Virtual Account (BNI, BRI, BSI, Mandiri)</span>
            <div>
              <span className="text-xs">
                Biaya Admin: {data.total >= 100000 ? "Rp4.000" : "Rp3000"}
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              handlePaymentMethod("QRIS");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black"
          >
            <span>QRIS</span>
            <div>
              <span className="text-xs">
                Biaya Admin: {data.total >= 100000 ? "Rp1.000" : "GRATIS"}
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              handlePaymentMethod("E_WALLET");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black"
          >
            <span>eWallet (Dana, OVO, ShopeePay)</span>
            <div>
              <span className="text-xs">Biaya Admin: Rp4.000</span>
            </div>
          </div>
          <div
            onClick={() => {
              handlePaymentMethod("RETAIL");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black"
          >
            <span>Alfamart</span>
            <div>
              <span className="text-xs">Biaya Admin: Rp5.000</span>
            </div>
          </div>
        </div>
      </InfoModal>
      <LoginModal
        showModal={showLogin}
        handleClose={() => {
          setLogin(false);
        }}
      >
        {LoginType === "register" ? (
          <Register callback={callback} id={"user"} />
        ) : (
          <Login callback={callback} id={"user"} />
        )}
      </LoginModal>
      <div className="text-center">
        <div className="my-4">
          <h2 className="text-2xl font-bold mt-12">Subtotal pembelian tiket</h2>
        </div>
        <div className="mt-4 mb-12">
          <h2 className="md:text-5xl text-3xl font-bold mt-8 animate-pulse">
            {isLoading ? (
              ""
            ) : (
              <CurrencyFormat
                value={isLoading ? 0 : total.total}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            )}
          </h2>
        </div>
        <div className="my-4 flex justify-center">
          {isLoading ? (
            <Skeleton className="w-80 h-16 rounded" count="1" />
          ) : (
            <SecondaryButton
              onClick={() => {
                setShowModal(true);
              }}
              className="w-80 h-16"
              label={pm !== "" ? `${swicthPM(pm)}` : `Pilih Metode Pembayaran`}
            />
          )}
        </div>
        <div>
          {isPmError ? <ErrorLabel label="Wajib isi metode pembayaran" /> : ""}
        </div>
        <div className={"mx-4"}>
          {/* Start Detail User */}
          <div className="text-left pt-4">
            <Label label="Catatan (Opsional)" />
            <MainTextArea
              value={notes}
              max="819"
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              name="notes"
              type="text"
            />
          </div>
          {/* End Detail User */}
        </div>
        {/* Countdown payment */}
        <div className={"mt-20 mb-36"}>
          <p>Selesaikan pembayaran dalam</p>
          <div>
            <h2 className="md:text-5xl text-3xl font-bold mt-4 animate-pulse">
              <Countdown
                date={moment(expired).format()}
                renderer={countDownRenderer}
              >
                <span>Expired</span>
              </Countdown>
            </h2>
          </div>
        </div>
        {/* Countdown payment */}
        <div className={"px-4 fixed w-full z-10 bottom-4"}>
          {isLoggedIn ? (
            <div>
              {isLoading ? (
                <Skeleton className="w-full h-16 rounded" count="1" />
              ) : (
                <MainButton
                  className="w-full h-16"
                  label={payLoading ? `Loading...` : `Bayar`}
                  onClick={() => {
                    handlePayment();
                  }}
                />
              )}
            </div>
          ) : (
            <div>
              {isLoading ? (
                <Skeleton className="w-full h-16 rounded" count="1" />
              ) : (
                <MainButton
                  className="w-full h-16"
                  label={loginLoading ? `Loading...` : `Login untuk bayar`}
                  onClick={() => {
                    setLogin(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;

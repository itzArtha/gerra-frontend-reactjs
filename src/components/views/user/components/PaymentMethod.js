import SecondaryButton from "../../../SecondaryButton";
import MainButton from "../../../MainButton";
import { useEffect, useState } from "react";
import InfoModal from "../../../modals/InfoModal";
import apiClient from "../../../services/apiClient";
import CurrencyFormat from "react-currency-format";
import Skeleton from "../../../Skeleton";
import ErrorLabel from "../../../ErrorLabel";
import { useHistory } from "react-router-dom";
const PaymentMethod = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [total, setTotal] = useState({
    total: 0,
    newTotal: 0,
  });
  const [data, setData] = useState({});
  const [pm, setPM] = useState("");
  const [isPmError, setPMError] = useState(false);
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
          setData(response.data);
          setTotal({
            total: response.data.total,
          });
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            history.push("/");
          }
        });
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
        })
        .then((response) => {
          if (response.status === 200) {
            // history.push("payment?ref_id=" + response.data);
            window.location.href = response.data;
            setPayLoading(false);
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    } else if (!pm) {
      setPMError(true);
    }
  };

  return (
    <>
      <InfoModal
        showModal={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        title={"Pilih Metode Pembayaran"}>
        <div>
          <div
            onClick={() => {
              handlePaymentMethod("VA");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black">
            <span>Virtual Account (BNI, BRI, BSI, Mandiri)</span>
            <div>
              <span className="text-xs">
                Biaya Admin: {data.total >= 100000 ? "Rp4.000" : "Rp.3000"}
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              handlePaymentMethod("QRIS");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black">
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
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black">
            <span>eWallet (Dana, OVO, ShopeePay)</span>
            <div>
              <span className="text-xs">Biaya Admin: Rp4.000</span>
            </div>
          </div>
          <div
            onClick={() => {
              handlePaymentMethod("RETAIL");
            }}
            className="my-2 p-4 font-semibold duration-200 cursor-pointer text-center bg-yellow-400 rounded-md hover:bg-yellow-300 border border-black">
            <span>Alfamart</span>
            <div>
              <span className="text-xs">Biaya Admin: Rp5.000</span>
            </div>
          </div>
        </div>
      </InfoModal>
      <div className="text-center">
        <div className="my-4">
          <h2 className="text-2xl font-bold mt-12">Total yang harus dibayar</h2>
        </div>
        <div className="mt-4 mb-8">
          <h2 className="md:text-5xl text-3xl font-bold mt-12 animate-pulse">
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
        <div className="my-12 flex justify-center">
          {isLoading ? (
            <Skeleton className="w-48 h-16 rounded" count="1" />
          ) : (
            <MainButton
              className="w-48 h-16"
              label={payLoading ? `Loading...` : `Bayar`}
              onClick={() => {
                handlePayment();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;

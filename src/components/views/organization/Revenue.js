import { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import MainButton from "../../MainButton";
import MainModal from "../../modals/MainModal";
import SecondaryButton from "../../SecondaryButton";
import apiClient from "../../services/apiClient";
import Skeleton from "../../Skeleton";
import MainBox from "./components/MainBox";
import TableRevenue from "./components/TableRevenue";
import Label from "../../Label";
import MainInput from "../../MainInput";
import ErrorLabel from "../../ErrorLabel";
import SelectInput from "../../SelectInput";
import TableWithdraw from "./components/TableWithdraw";
import handleSwal from "../../handleSwal";

const Revenue = () => {
  const [status, setStatus] = useState("pemasukan");
  const [type, setType] = useState("revenue");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rek, setRek] = useState([]);
  const [balance, setBalance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [data, setData] = useState([]);
  const [wdData, setWdData] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    isAmountError: false,
    amountErrorLabel: "",
    rekening: 0,
    isRekenigError: false,
    rekeningErrorLabel: "",
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/organization/revenue")
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          // console.log(error.response.data);
          setLoading(false);
        });
    };

    const fetchRekening = async () => {
      await apiClient.get("/api/v1/organization/bank").then((response) => {
        setRek(response.data.data);
      });
    };

    fetchRekening();
    fetchBalance();
    fetchWd();
    fetchRevenue();
    fetchBonus();
  }, []);

  const fetchBalance = async () => {
    await apiClient.get("/api/v1/organization").then((response) => {
      setBalance(response.data.data.balance);
    });
  };

  const fetchBonus = async () => {
    await apiClient.get("/api/v1/organization/bonuses").then((response) => {
      setBonus(response.data.data);
    });
  };

  const fetchWd = async () => {
    setLoading(true);
    await apiClient
      .get(`/api/v1/organization/withdraw`)
      .then((response) => {
        setWdData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(error.response.data);
      });
  };

  const handleWd = async () => {
    setProcessing(true);
    let amount = formData.amount.replace(/\D/g, "");
    await apiClient
      .post(`/api/v1/organization/${type}/withdraw`, {
        amount: amount,
        bank_id: formData.rekening,
      })
      .then((response) => {
        fetchBalance();
        fetchWd();
        setShowModal(false);
        setFormData({ ...formData, amount: "", rekening: "" });
        handleSwal(response.data.message);
        setProcessing(false);
        setStatus("penarikan");
      })
      .catch((error) => {
        handleSwal(error.response.data.message, "error");
        setProcessing(false);
      });
  };

  return (
    <>
      {/* Modal */}
      <MainModal
        handleClose={() => {
          setShowModal(false);
        }}
        buttonLabel={processing ? `Loading...` : `Tarik`}
        showModal={showModal}
        onClick={handleWd}
        title={`Tarik Dana`}
      >
        <div>
          <div className="my-2">
            <Label label="Jumlah" />
            <CurrencyFormat
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
              }}
              thousandSeparator={true}
              prefix={"Rp"}
              value={formData.amount}
              customInput={MainInput}
            />
          </div>
          <div className="my-2">
            <Label label="Rekening" />
            <SelectInput
              name="text"
              value={formData.rekening}
              onChange={(e) => {
                setFormData({ ...formData, rekening: e.target.value });
              }}
            >
              <option defaultValue="">Pilih rekening</option>
              {rek.map((item, i) => (
                <option key={item.id} value={item.id}>
                  {item.account_no + " - " + item.holder_name}
                </option>
              ))}
            </SelectInput>
            {formData.isRekenigError ? (
              <ErrorLabel label={formData.rekeningErrorLabel} />
            ) : (
              ""
            )}
          </div>
        </div>
      </MainModal>
      {/* Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300 pt-8">
          <div className="font-semibold text-5xl pb-4">
            {" "}
            <CurrencyFormat
              value={bonus}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp"}
            />
          </div>
          <div className="font-light text-lg pt-4">
            Total bonus dari transaksi,{" "}
            <a
              className={"text-blue-600 font-semibold text-sm hover:underline"}
              target={"_blank"}
              href="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/TokoeventBonus.pdf"
            >
              Pelajari selengkapnya
            </a>
          </div>
          <div className="text-right">
            <SecondaryButton
              className="mt-4"
              type="button"
              onClick={() => {
                setType("bonus");
                setShowModal(true);
              }}
              label="Tarik Bonus"
            />
          </div>
        </MainBox>
        <MainBox className="bg-red-400 hover:bg-red-300 pt-8">
          <div className="font-semibold text-5xl pb-4">
            {" "}
            <CurrencyFormat
              value={balance}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp"}
            />
          </div>
          <div className="font-light text-lg pt-4">
            Total saldo pendapatan penjualan
          </div>
          <div className="text-right">
            <MainButton
              className="mt-4"
              type="button"
              onClick={() => {
                setType("revenue");
                setShowModal(true);
              }}
              label="Tarik Dana"
            />
          </div>
        </MainBox>
      </div>
      <div className="mt-12">
        <h2 className="font-semibold text-2xl">Aktivitas Terakhir</h2>
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <SecondaryButton
              className={`mt-4 ${
                status.includes("pemasukan") && "bg-yellow-400"
              }`}
              type="button"
              onClick={() => {
                setStatus("pemasukan");
              }}
              label="Pemasukan"
            />
            <SecondaryButton
              onClick={() => {
                setStatus("penarikan");
              }}
              className={`mt-4 ${
                status.includes("penarikan") && "bg-yellow-400"
              }`}
              type="button"
              label="Penarikan"
            />
          </div>
          <div className="mt-8">
            <h2 className="font-semibold capitalize my-2">{status}</h2>
            {loading ? (
              <Skeleton className="w-full h-24 rounded" count="1" />
            ) : data.length > 0 ? (
              status.includes("pemasukan") ? (
                <TableRevenue data={data} />
              ) : (
                <TableWithdraw data={wdData} />
              )
            ) : (
              <div className="flex justify-center">
                <span>Belum ada data</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Revenue;

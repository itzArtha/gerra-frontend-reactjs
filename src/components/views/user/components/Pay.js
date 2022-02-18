import { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import MainButton from "../../../MainButton";
import InfoModal from "../../../modals/InfoModal";
import apiClient from "../../../services/apiClient";
import useQuery from "../../../useQuery";
import Pusher from "pusher-js";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Skeleton from "../../../Skeleton";

const Pay = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const query = useQuery();
  const history = useHistory();
  useEffect(() => {
    const pusher = new Pusher("b97c818f3ea7eb3a15fe", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe(`payment.${query.get("ref_id")}`);
    channel.bind("Handler", (data) => {
      fetchData();
      if (data.transaction === "settlement") {
        history.push(`/payment?ref_id=${query.get("ref_id")}&status=success`);
      }
    });

    const fetchData = async () => {
      await apiClient
        .get("/api/v1/user/payment/show/" + query.get("ref_id"))
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          //   console.log(error.response);
          setLoading(false);
        });
    };
    setLoading(true);
    fetchData();
  }, [setData]);

  const handleStatus = () => {
    switch (data.status) {
      case "pending":
        return {
          icon: "deadline",
          label: "Menunggu Pembayaran",
        };
      case "expire":
        return {
          icon: "expired",
          label: "Pembayaran Kedaluarsa",
        };
      case "settlement":
        return {
          icon: "checked",
          label: "Pembayaran Sukses",
        };
      case "deny":
        return {
          icon: "expired",
          label: "Pembayaran Gagal",
        };
      default:
        return {
          icon: "expired",
          label: "Aktivitas tidak dikenali",
        };
    }
  };

  const handlePaymentType = () => {
    switch (data.channel) {
      case "bni":
        return {
          title: "Bank BNI",
          code: JSON.parse(data.actions)[0]["va_number"],
          how: (
            <div className="text-justify md:w-1/3 w-full mx-2">
              <tr className="flex gap-2">
                <td>1.</td>
                <td>
                  Jika menggunakan bank BNI pilih bayar dengan{" "}
                  <b>Virtual Account</b>. Jika tidak, pilih{" "}
                  <b>transfer ke bank lain</b> lalu masukkan kode bank BNI{" "}
                  <b>009</b>
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>2.</td>
                <td>
                  Masukkan kode pembayaran{" "}
                  <b> {JSON.parse(data.actions)[0]["va_number"]} </b> di atas
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>3.</td>
                <td>
                  Pastikan{" "}
                  <b> jumlah pembayaran sesuai dengan total pembayaran</b> yang
                  tertera di atas
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>4.</td>
                <td className="text-red-500">
                  <b>
                    Jumlah pembayaran yang kurang tidak akan diproses oleh
                    sistem,
                  </b>{" "}
                  kalo lebih ya makasih h3h3h3
                </td>
              </tr>
            </div>
          ),
        };
      case "gopay":
        return {
          title: "QRIS",
          code: (
            <img
              className="w-48"
              src={JSON.parse(data.actions)[0]["url"]}
              alt="qr-code"
            />
          ),
          open: JSON.parse(data.actions)[1]["url"],
          how: (
            <div className="text-justify md:w-1/3 w-full mx-2">
              <tr className="flex gap-2">
                <td>1.</td>
                <td>
                  Kamu bisa menggunakan layanan pembayaran seperti Go-pay, OVO,
                  Dana, Link Aja, dsb
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>2.</td>
                <td>
                  Scan qrcode di atas untuk melakukan pembayaran. Jika kamu
                  ingin membayar dengan Go-pay, kamu bisa klik tombol "Buka App
                  Gojek" untuk langsung diarahkan ke app
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>3.</td>
                <td>
                  Pastikan{" "}
                  <b> jumlah pembayaran sesuai dengan total pembayaran</b> yang
                  tertera di atas
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>4.</td>
                <td className="text-red-500">
                  <b>
                    Jumlah pembayaran yang kurang tidak akan diproses oleh
                    sistem,
                  </b>{" "}
                  kalo lebih ya makasih h3h3h3
                </td>
              </tr>
            </div>
          ),
        };
      case "permata":
        return {
          title: "Bank Permata",
          code: data.actions,
          how: (
            <div className="text-justify md:w-1/3 w-full mx-2">
              <tr className="flex gap-2">
                <td>1.</td>
                <td>
                  Jika menggunakan bank Permata pilih bayar dengan{" "}
                  <b>Virtual Account</b>. Jika tidak, pilih{" "}
                  <b>transfer ke bank lain</b> lalu masukkan kode bank Permata{" "}
                  <b>013</b>
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>2.</td>
                <td>
                  Masukkan kode pembayaran <b> {data.actions} </b> di atas
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>3.</td>
                <td>
                  Pastikan{" "}
                  <b> jumlah pembayaran sesuai dengan total pembayaran</b> yang
                  tertera di atas
                </td>
              </tr>
              <tr className="flex gap-2">
                <td>4.</td>
                <td className="text-red-500">
                  <b>
                    Jumlah pembayaran yang kurang tidak akan diproses oleh
                    sistem,
                  </b>{" "}
                  kalo lebih ya makasih h3h3h3
                </td>
              </tr>
            </div>
          ),
        };
      default:
        return "Metode tidak dikenali";
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(handlePaymentType().code);
    handleSwal("Berhasil menyalin kode pembayaran");
  };

  const handleSwal = (data, status) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: status ? status : "success",
      title: data,
    });
  };

  return (
    <>
      <InfoModal
        showModal={showPaymentModal}
        handleClose={() => {
          setShowPaymentModal(false);
        }}
        title={"Detail Pembayaran"}
      >
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-24 h-24 rounded" count="1" />
          ) : (
            <img
              className="w-24"
              src={process.env.PUBLIC_URL + `/${handleStatus().icon}.svg`}
              alt="Icon"
            />
          )}
        </div>
        <div className="text-center flex justify-center">
          {loading ? (
            <Skeleton className="w-12 h-4 rounded" count="1" />
          ) : (
            <span>{handleStatus().label}</span>
          )}
        </div>
        <div className="mt-12">
          <tr className="flex justify-between border-b py-2">
            <td>Subtotal</td>
            <td>
              {" "}
              <CurrencyFormat
                value={loading ? 0 : data.subtotal}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            </td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Biaya Admin</td>
            <td>
              {" "}
              <CurrencyFormat
                value={loading ? 0 : data.admin}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            </td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Diskon</td>
            <td>
              {" "}
              <CurrencyFormat
                value={loading ? 0 : data.discount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            </td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Total</td>
            <td>
              {" "}
              <CurrencyFormat
                value={loading ? 0 : data.total}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            </td>
          </tr>
        </div>
      </InfoModal>
      <div className="text-center">
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-24 h-24 rounded" count="1" />
          ) : (
            <img
              className={`w-24 ${
                data.status === "settlement"
                  ? "animate-bounce"
                  : "animate-pulse"
              }`}
              src={process.env.PUBLIC_URL + `/${handleStatus().icon}.svg`}
              alt="Icon"
            />
          )}
        </div>
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-48 h-4 rounded" count="1" />
          ) : (
            <span>{handleStatus().label}</span>
          )}
        </div>
        {data.status === "pending" ? (
          <div>
            <div className="my-4">
              <h4 className="text-2xl font-medium">
                Silakan bayar menggunakan
              </h4>
              <div className="my-2 flex justify-center">
                {loading ? (
                  <Skeleton className="w-28 h-8 rounded" count="1" />
                ) : (
                  <h4 className="text-2xl font-bold">
                    {handlePaymentType().title}
                  </h4>
                )}
              </div>
            </div>
            <div className="mb-8 mt-4 flex justify-center">
              {loading ? (
                <Skeleton className="w-72 h-16 rounded-full" count="1" />
              ) : (
                <div>
                  {data.channel === "gopay" ? (
                    <div>
                      {handlePaymentType().code}
                      <a
                        target={"__blank"}
                        href={handlePaymentType().open}
                        className="font-semibold px-4 py-2 tracking-wide border border-black text-black transition-colors duration-200 transform bg-yellow-400 rounded-md hover:bg-yellow-300 focus:outline-none"
                      >
                        Buka App Gojek
                      </a>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        handleCopyText();
                      }}
                      className="flex gap-2 border rounded-full border-black duration-200 bg-yellow-400 hover:bg-yellow-300 py-4 px-16 font-semibold text-2xl cursor-pointer"
                    >
                      {handlePaymentType().code}
                      <img
                        className="mt-1 w-6 h-6"
                        src={process.env.PUBLIC_URL + "/copy.svg"}
                        alt=""
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              {loading ? (
                <Skeleton className="w-32 h-6 rounded" count="1" />
              ) : (
                <h4 className="text-2xl font-bold animate-pulse">
                  <CurrencyFormat
                    value={loading ? 0 : data.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </h4>
              )}
            </div>
            <div className="my-4">
              <span className="font-semibold">Tata cara pembayaran</span>
            </div>
            <div className="my-4 flex justify-center">
              {loading ? (
                <Skeleton className="w-72 h-28 rounded" count="1" />
              ) : (
                handlePaymentType().how
              )}
            </div>
            <div className="mt-12 flex justify-center">
              {loading ? (
                <Skeleton className="w-48 h-10 rounded" count="1" />
              ) : (
                <MainButton
                  onClick={() => {
                    setShowPaymentModal(true);
                  }}
                  label="Detail Pembayaran"
                />
              )}
            </div>
          </div>
        ) : data.status === "settlement" ? (
          <div>
            <h4 className="text-2xl font-medium">
              Pembayaran sudah dilakukan, mantap gan!
            </h4>
          </div>
        ) : loading ? (
          ""
        ) : (
          <div>
            <h4 className="text-2xl font-medium">
              Pembayaran sudah kedaluarsa, <br /> mohon untuk tidak melanjutkan
              pembayaran ini, <br /> kalo gamau uangnya ilang. Okey?
            </h4>
          </div>
        )}
      </div>
    </>
  );
};
export default Pay;

import { useState, useEffect } from "react";
import MainButton from "../../../MainButton";
import TicketDetail from "./TicketDetail";
import { useHistory } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import useQuery from "../../../useQuery";
import Skeleton from "../../../Skeleton";

const FinishPayment = () => {
  const history = useHistory();
  const query = useQuery();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/user/transaction/payment/" + query.get("ref_id"))
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          //   console.log(error.response);
          setLoading(false);
        });
    };
    const handleStatus = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/user/payment/status/" + query.get("ref_id"))
        .then((response) => {
          if (response.data.transaction_status === "settlement") {
            fetchData();
          } else {
            history.push("/");
          }
        });
    };
    handleStatus();
  }, [setData]);
  return (
    <>
      <div className="text-center">
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-24 h-24 rounded-full" count="1" />
          ) : (
            <img
              className="w-24"
              src={process.env.PUBLIC_URL + "/checked.svg"}
              alt="Icon"
            />
          )}
        </div>
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-36 h-4 rounded-full" count="1" />
          ) : (
            <span>Pembayaran Sukses</span>
          )}
        </div>
        <div className="md:w-1/2 w-full mx-auto my-8">
          {loading ? (
            <Skeleton className="h-48 w-full rounded" count="1" />
          ) : (
            data.map((item, i) => (
              <TicketDetail key={i} transaction={item} loading={loading} />
            ))
          )}
        </div>
        {loading ? (
          <div className="justify-center flex">
            <div className="w-1/3 grid grid-cols-2 gap-2 mt-12">
              <Skeleton className="h-10 w-full rounded" count="1" />
              <Skeleton className="h-10 w-full rounded" count="1" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-2 mt-12">
            <MainButton
              onClick={() => {
                history.push("/");
              }}
              label="Halaman Utama"
            />
            <MainButton
              onClick={() => {
                history.push("/tickets");
              }}
              label="Semua Tiket"
            />
          </div>
        )}
      </div>
    </>
  );
};
export default FinishPayment;

import { useEffect, useState } from "react";
import ExportToExcel from "../../../ExportToExcel";
import MainButton from "../../../MainButton";
import apiClient from "../../../services/apiClient";
import TablePenjualan from "../components/TablePenjualan";
import moment from "moment";
import Skeleton from "../../../Skeleton";

const Penjualan = ({ slug }) => {
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileName = "data-penjualan";
  useEffect(() => {
    const fetchPenjualan = () => {
      setLoading(true);
      apiClient
        .get("/api/v1/organization/transaction/event?eventid=" + slug)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          let newArray = [];
          // eslint-disable-next-line array-callback-return
          response.data.data.map((item) => {
            let obj = {
              "ID Transaksi": item.id,
              "Nama Tiket": item.ticket,
              "Nama Pembeli": item.name,
              "Email Pembeli": item.email,
              "No. Telepon Pembeli": item.phone,
              Subtotal: item.subtotal,
              Status: item.status,
              "Tanggal Transaksi": moment(item.created_at).format("lll"),
            };

            newArray.push(obj);
            setExportData(newArray);
          });
        });
    };
    fetchPenjualan();
  }, [slug]);
  return (
    <div>
      <div className="my-4 flex justify-end">
        {loading ? (
          <Skeleton className="w-28 h-10 rounded" count="1" />
        ) : (
          <MainButton
            onClick={() => {
              ExportToExcel(exportData, fileName);
            }}
            label="Export Data"
          />
        )}
      </div>
      <div title="table" className="my-4">
        {loading ? (
          <span className="flex justify-center">Loading...</span>
        ) : (
          <TablePenjualan data={data} />
        )}
      </div>
    </div>
  );
};
export default Penjualan;

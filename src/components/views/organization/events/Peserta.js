import { useEffect, useState } from "react";
import ExportToExcel from "../../../ExportToExcel";
import MainButton from "../../../MainButton";
import apiClient from "../../../services/apiClient";
import TablePeserta from "../components/TablePeserta";
import moment from "moment";
import Skeleton from "../../../Skeleton";

const Peserta = ({ slug }) => {
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileName = "data-peserta";
  useEffect(() => {
    const fetchPenjualan = () => {
      setLoading(true);
      apiClient
        .get("/api/v1/user/participant?eventid=" + slug)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          let newArray = [];
          // eslint-disable-next-line array-callback-return
          response.data.data.map((item) => {
            let parsedData = JSON.parse(item.data);
            let obj = {
              "ID Peserta": item.id,
              "Nama Peserta": item.name,
              Email: item.email,
              Instansi: parsedData.instansi,
              "Jenis Kelamin": parsedData.sex === 0 ? "Wanita" : parsedData.sex === 1 ? "Pria" : null,
              "Tanggal Lahir": parsedData.birthday,
              KTP: parsedData.ktp,
              "No. Telepon": parsedData.hp,
              Tiket: item.ticket,
              "Tanggal Registrasi": moment(item.created_at).format("lll"),
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
          <TablePeserta data={data} />
        )}
      </div>
    </div>
  );
};
export default Peserta;

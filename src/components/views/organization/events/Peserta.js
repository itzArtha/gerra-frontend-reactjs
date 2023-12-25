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
    const fetchPenjualan = async () => {
      setLoading(true);
      return await apiClient
        .get("/api/v1/user/participant?eventid=" + slug)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          let newArray = [];
          // eslint-disable-next-line array-callback-return
          response.data.data.map((item) => {
            let obj = {
              "ID Peserta": item.id,
              "Nama Peserta": item.name,
              "Nama Tiket": item.ticket_name,
              "Harga Tiket": item.ticket_price,
              Email: item.email,
              NIM: item.nim,
              Referral: item.referral,
              Hadir: item.presence,
              "No. Telepon": item.phone,
              "Tanggal Registrasi": moment(item.created_at).format("lll"),
            };
            newArray.push(obj);
            setExportData(newArray);
          });

          return response.data.data;
        });
    };

    fetchPenjualan().then((r) => {
      window.Echo.channel("event." + slug).listen(
        ".NewParticipantPresence",
        (event) => {
          let newArrayData = r.filter((item) => item.uuid !== event.data.uuid);
          setData(() => [...newArrayData, event.data].reverse());
        }
      );
    });
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

import { useState } from "react";
import MainButton from "../../../MainButton";
import SecondaryButton from "../../../SecondaryButton";
import DetailPresensi from "../components/DetailPresensi";
import TablePresensi from "../components/TablePresensi";

const Presensi = () => {
  const [status, setStatus] = useState("detail");
  return (
    <div>
      <div className="py-4">
        <div className="my-4 flex gap-2 justify-start">
          <div title="Detail">
            {status === "detail" ? (
              <MainButton label="Detail & QR" />
            ) : (
              <SecondaryButton
                onClick={() => {
                  setStatus("detail");
                }}
                label="Detail & QR"
              />
            )}
          </div>
          <div title="Presensi">
            {status === "presensi" ? (
              <MainButton label="Data Presensi" />
            ) : (
              <SecondaryButton
                onClick={() => {
                  setStatus("presensi");
                }}
                label="Data Presensi"
              />
            )}
          </div>
        </div>
      </div>
      {status === "detail" ? (
        <DetailPresensi />
      ) : (
        <div title="Tables">
          <div className="my-4 flex gap-2 justify-end">
            <MainButton label="Export Data" />
            <MainButton label="Tambah Data" />
          </div>
          <div title="table" className="my-4">
            <TablePresensi />
          </div>
        </div>
      )}
    </div>
  );
};
export default Presensi;

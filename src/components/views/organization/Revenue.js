import { useState } from "react";
import MainButton from "../../MainButton";
import SecondaryButton from "../../SecondaryButton";
import MainBox from "./components/MainBox";
import TableActivity from "./components/TableActivity";

const Revenue = () => {
  const [status, setStatus] = useState("pemasukan");
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300 pt-8">
          <div className="font-semibold text-5xl pb-4">Rp250k</div>
          <div className="font-light text-lg pt-4">
            Saldo ini dapat dicairkan setelah 3 hari dari masuk transaksi
          </div>
        </MainBox>
        <MainBox className="bg-red-400 hover:bg-red-300 pt-8">
          <div className="font-semibold text-5xl pb-4">Rp10k</div>
          <div className="font-light text-lg pt-4">
            Saldo ini adalah saldo yang sudah bisa kamu tarik
          </div>
          <div className="text-right">
            <MainButton className="mt-4" type="button" label="Tarik Dana" />
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
            <h2 className="font-semibold capitalize">{status}</h2>
            <TableActivity />
          </div>
        </div>
      </div>
    </>
  );
};
export default Revenue;

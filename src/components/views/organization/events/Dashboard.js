import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import MainBox from "../components/MainBox";

const Dashboard = () => {
  const [isLoading, setLoading] = useState();
  const [countEvent, setCountEvent] = useState(0);
  const [event, setEventData] = useState([]);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{countEvent}</div>
          <div className="font-light text-lg text-right pt-2">Peserta</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">100k</div>
          <div className="font-light text-lg text-right pt-2">Penjualan</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">10</div>
          <div className="font-light text-lg text-right pt-2">Transaksi</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">10</div>
          <div className="font-light text-lg text-right pt-2">Pengunjung</div>
        </MainBox>
      </div>
      <div className="mt-12">
        <h2 className="text-center font-semibold text-2xl">Statistik</h2>
      </div>
    </>
  );
};
export default Dashboard;

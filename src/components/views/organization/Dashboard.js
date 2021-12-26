import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import EventBox from "./components/EventBox";
import MainBox from "./components/MainBox";
import TableActivity from "./components/TableActivity";

const Dashboard = () => {
  const [isLoading, setLoading] = useState();
  const [countEvent, setCountEvent] = useState(0);
  const [event, setEventData] = useState([]);
  useEffect(() => {
    const fetchEventData = () => {
      apiClient
        .get("/api/v1/organization/event?limit=2")
        .then((response) => {
          setEventData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          //
        });
    };

    const fetchCountData = async () => {
      await apiClient
        .get("/api/v1/organization/count/event")
        .then((response) => {
          setCountEvent(response.data.data);
        })
        .catch((error) => {
          //
        });
    };
    setLoading(true);
    fetchCountData();
    fetchEventData();
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{countEvent}</div>
          <div className="font-light text-lg text-right pt-2">Events</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">100k</div>
          <div className="font-light text-lg text-right pt-2">Pemasukan</div>
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
        <h2 className="text-center font-semibold text-2xl">
          Aktivitas Terakhir
        </h2>
        <div className="mt-4">
          <h2 className="font-semibold">Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {isLoading
              ? "Loading..."
              : event.map((item, i) => (
                  <EventBox key={i} data={item} loading={isLoading} />
                ))}
          </div>
          <div className="mt-8">
            <h2 className="font-semibold">Peserta</h2>
            <TableActivity />
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;

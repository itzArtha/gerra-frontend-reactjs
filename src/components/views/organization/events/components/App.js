/* eslint-disable no-unreachable */
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useQuery from "../../../../useQuery";
import Dashboard from "../Dashboard";
import Pengurus from "../Pengurus";
import Peserta from "../Peserta";
import Penjualan from "../Penjualan";
import Presensi from "../Presensi";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const query = useQuery();
  const history = useHistory();
  const router = query.get("tab");
  const { slug } = useParams();
  const handleContent = () => {
    switch (router) {
      case "dashboard":
        return <Dashboard />;
      case "pengurus":
        return <Pengurus slug={slug} />;
      case "peserta":
        return <Peserta slug={slug} />;
      case "penjualan":
        return <Penjualan slug={slug} />;
      case "presensi":
        return <Presensi />;
      default:
        window.location.href = `${window.location.origin}/admin/event/${slug}?tab=dashboard`;
        break;
    }
  };
  return (
    <>
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          route={router}
          data={data}
          loading={loading}
        />
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="p-4 md:ml-72">
            <h2 className="capitalize font-semibold text-2xl">{router}</h2>
            <div className="mt-4">{handleContent()}</div>
          </main>
        </div>
      </div>
    </>
  );
};
export default App;

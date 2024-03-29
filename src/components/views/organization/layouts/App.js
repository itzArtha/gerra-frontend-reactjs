/* eslint-disable no-unreachable */
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Dashboard from "../Dashboard";
import Event from "../Event";
import Revenue from "../Revenue";
import Setting from "../Setting";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import apiClient from "../../../services/apiClient";
import ScanQR from "./components/ScanQR";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const { router } = useParams();
  const history = useHistory();

  useEffect(() => {
    const handleFetchData = () => {
      apiClient
        .get("/api/v1/organization")
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            history.push("/login");
          } else {
            //
          }
        });
    };
    handleFetchData();
  }, [setData]);

  const handleContent = () => {
    switch (router) {
      case "dashboard":
        return <Dashboard />;
      case "pemasukan":
        return <Revenue />;
      case "event":
        return <Event />;
      case "pengaturan":
        return <Setting />;
      default:
        history.push("./dashboard");
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
            <div className="mt-4">{handleContent(data)}</div>
          </main>
          {router === "dashboard" ? <ScanQR /> : null}
        </div>
      </div>
    </>
  );
};
export default App;

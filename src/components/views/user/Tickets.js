import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Header from "./Profile/Header";
import AllTickets from "./components/AllTickets";
import MainLayout from "../../layouts/MainLayout";

const Tickets = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { router } = useParams();
  const history = useHistory();
  useEffect(() => {
    const handleFetchData = () => {
      apiClient
        .get("/api/v1/user")
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          document.getElementById("title").innerHTML =
            response.data.data.name.split(" ")[0] + " - " + document.title;
        })
    };
    handleFetchData();
  }, [setData]);

  const handleContent = () => {
    switch (router) {
      case "all-tickets":
        return {
          label: "Semua Tiket",
          view: <AllTickets sort={"all"} />,
        };
      case "not-yet":
        return {
          label: "Belum Mulai",
          view: <AllTickets sort={"not-yet"} />,
        };
      case "started":
        return {
          label: "Sedang Dimulai",
          view: <AllTickets sort={"started"} />,
        };
      case "passed":
        return {
          label: "Sudah Lewat",
          view: <AllTickets sort={"passed"} />,
        };
      case "unpaid":
        return {
          label: "Belum Dibayar",
          view: <AllTickets sort={"unpaid"} />,
        };
      default:
        history.push("/");
        break;
    }
  };
  return (
    <MainLayout menu={true}>
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          data={data}
          route={router}
          loading={loading}
        />

        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header
            logout={false}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="p-4 md:ml-72">
            <h2 className="capitalize font-semibold text-2xl">
              {handleContent().label}
            </h2>
            <div className="mt-4">{handleContent().view}</div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
};
export default Tickets;

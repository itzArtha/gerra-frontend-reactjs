import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import Header from "../Profile/Header";
import Content from "./Content";
import MainLayout from "../../../layouts/MainLayout";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
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
        .catch((error) => {
          if (error.response.status === 401) {
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
      case "announcements":
        return {
          label: "Pengumuman",
          view: <Content sort={"announcements"} />,
        };
      case "transactions":
        return {
          label: "Transaksi",
          view: <Content sort={"transactions"} />,
        };
      case "updates":
        return {
          label: "Update",
          view: <Content sort={"updates"} />,
        };
      case "promotions":
        return {
          label: "Promo",
          view: <Content sort={"promotions"} />,
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
export default Dashboard;

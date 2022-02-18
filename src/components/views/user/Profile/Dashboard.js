import Sidebar from "./Sidebar";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import Header from "./Header";
import Biodata from "./Biodata";
import Notifikasi from "./Notifikasi";
import Security from "./Security";
import isUser from "../../../services/isUser";

const Dashboard = () => {
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
            response.data.data.name.split(" ")[0] + " - exotix";
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
      case "biodata":
        return <Biodata />;
        break;
      case "notifikasi":
        return <Notifikasi />;
        break;
      case "keamanan":
        return <Security />;
        break;
      default:
        history.push("./biodata");
        break;
    }
  };
  return (
    <>
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          data={data}
          route={router}
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
export default Dashboard;

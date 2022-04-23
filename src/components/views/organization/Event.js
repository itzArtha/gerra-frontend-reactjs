import TableEvent from "./components/TableEvent";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Swal from "sweetalert2";
import Skeleton from "../../Skeleton";

const Event = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/organization/event")
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 421) {
            history.push("/login");
          }
          setLoading(false);
        });
    };
    fetchData();
  }, [setData]);

  const callback = useCallback((value) => {
    handleDelete(value);
  }, []);

  const handleDelete = async (id) => {
    await apiClient
      .delete("/api/v1/organization/event/" + id)
      .then((response) => {
        handleSwal(response.data.message);
        apiClient.get("/api/v1/organization/event").then((response) => {
          setData(response.data.data);
        });
      })
      .catch((error) => {
        //
      });
  };

  const handleSwal = (data, status) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: status ? status : "success",
      title: data,
    });
  };

  return (
    <>
      <div className="mt-12">
        {isLoading ? (
          <Skeleton className="w-full h-24 rounded" count="2" />
        ) : data.length > 0 ? (
          <TableEvent callback={callback} data={data} />
        ) : (
          <div className="flex justify-center">
            <span>Belum ada data</span>
          </div>
        )}
      </div>
    </>
  );
};
export default Event;

import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import NotifBar from "../components/NotifBar";

const Content = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const callback = useCallback((id) => {
    handleRead(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/user/notifications/" + props.sort)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          //   console.log(error);
        });
    };
    setData([]);
    fetchData();
  }, [props.sort]);

  const fetchData = async () => {
    await apiClient
      .get("/api/v1/user/notifications/" + props.sort)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        //   console.log(error);
      });
  };

  const handleRead = async (id) => {
    await apiClient
      .put("/api/v1/user/notifications/" + id)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <div>
      <div className="flex justify-center">
        <span>
          {isLoading ? "Memuat data" : data.length > 0 ? "" : "Belum ada data"}
        </span>
      </div>
      {data.map((item, i) => (
        <NotifBar
          callback={callback}
          data={item}
          key={i}
          sort={props.sort}
          loading={isLoading}
        />
      ))}
    </div>
  );
};
export default Content;

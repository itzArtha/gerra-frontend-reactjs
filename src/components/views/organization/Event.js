import TableEvent from "./components/TableEvent";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiClient from "../../services/apiClient";

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
        });
    };
    fetchData();
  }, [setData]);
  return (
    <>
      <div className="mt-12">
        {isLoading ? "Loading..." : <TableEvent data={data} />}
      </div>
    </>
  );
};
export default Event;

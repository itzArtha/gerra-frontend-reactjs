import { useCallback, useEffect, useState } from "react";
import MainSearch from "../../../MainSearch";
import apiClient from "../../../services/apiClient";
import TicketDetail from "./TicketDetail";

const AllTickets = (props) => {
  const callback = useCallback((search) => {
    setSearch(search);
  }, []);
  const [search, setSearch] = useState();
  const [isEmpty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await apiClient
        .get("/api/v1/user/show/participant?sort=" + props.sort)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          setEmpty(false);
        })
        .catch((error) => {
          // console.log(error.response);
          setEmpty(true);
        });
    };
    fetchData();
  }, [props.sort]);

  // const filteredPersons = allUsers.filter((person) => {
  //   return person.name.toLowerCase().includes(search.toLowerCase());
  // });

  return (
    <>
      <div className="p-4">
        {/* <MainSearch searchCallback={callback} placeholder={"Cari Tiket..."} />
        {search && (
          <div className="my-2">
            <p>
              Menampilkan hasil untuk <b>{search}</b>
            </p>
          </div>
        )} */}
        {loading ? (
          <div className="flex justify-center">
            {isEmpty ? "Tidak ada data" : "Memuat data"}
          </div>
        ) : (
          <div>
            {data.map((item, i) => (
              <div className="my-2" key={i}>
                <TicketDetail
                  type={props.sort}
                  key={i}
                  transaction={item}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default AllTickets;

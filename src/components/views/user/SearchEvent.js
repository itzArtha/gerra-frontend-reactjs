import MainLayout from "../../layouts/MainLayout";
import Checkbox from "../../Checkbox";
import MainTicketBar from "./components/MainTicketBar";
import MainSearchBarWithSelect from "../../MainSearchBarWithSelect";
import { useState, useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import MainButton from "../../MainButton";
import apiClient from "../../services/apiClient";

const SearchEvent = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(Array);
  const [filter, setFilter] = useState({
    seminar: false,
    kompetisi: false,
    newest: false,
    mostViewed: false,
  });
  const [hidden, setHidden] = useState(true);
  const location = useLocation();
  const history = useHistory();

  const callback = useCallback((search) => {
    handleSearching(search);
  }, []);
  const lastPath = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const handleSearching = (search) => {
    setSearch(search);
  };

  const filteredEvents = event.filter((event) => {
    return event.title.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    setLoading(true);
    searchData();
  }, [setEvent]);

  const searchData = () => {
    setLoading(true);
    apiClient
      .get("/api/v1/organization/all/event")
      .then((response) => {
        setEvent(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        //
      });
  };

  const filterData = () => {
    setLoading(true);
    apiClient
      .get("/api/v1/organization/all/event")
      .then((response) => {
        setEvent(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        //
      });
  };

  const handleLoadMore = () => {
    //
  };

  const handleFilter = (e) => {
    e.preventDefault();
    filterData(e);
    history.push(
      `?seminar=${filter.seminar}&kompetisi=${filter.kompetisi}&newest=${filter.newest}&thismonth=${filter.thismonth}&mostViewed=${filter.mostViewed}`
    );
  };
  return (
    <>
      <MainLayout top={true} menu={true}>
        <div className="mt-12 mx-4 md:mx-12">
          <div className="md:col-span-3">
            <MainSearchBarWithSelect
              searchCallback={callback}
              lastPath={lastPath}
            />
            {search && (
              <div className="my-2">
                <p>
                  Menampilkan hasil untuk <b>{search}</b>
                </p>
              </div>
            )}
            <div className="products">
              <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-4 gap-2">
                {loading ? (
                  <>
                    <MainTicketBar loading={loading} />
                    <MainTicketBar loading={loading} />
                    <MainTicketBar loading={loading} />
                    <MainTicketBar loading={loading} />
                    <MainTicketBar loading={loading} />
                  </>
                ) : (
                  filteredEvents.map((item, i) => (
                    <MainTicketBar data={item} key={i} loading={loading} />
                  ))
                )}
              </div>
            </div>
            {/*                          <div className={"bottom-0 flex justify-center pt-24"}>
                                <MainButton onClick={handleLoadMore} label={"Load More"}/>
                            </div>*/}
          </div>
        </div>
        {/*</div>*/}
      </MainLayout>
    </>
  );
};
export default SearchEvent;

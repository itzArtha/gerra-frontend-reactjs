import MainLayout from "../../layouts/MainLayout";
import Checkbox from "../../Checkbox";
import MainTicketBar from "./components/MainTicketBar";
import MainSearchBarWithSelect from "../../MainSearchBarWithSelect";
import { useState, useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import MainButton from "../../MainButton";
import apiClient from "../../services/apiClient";

const SearchEvent = () => {
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(Array);
  const [filter, setFilter] = useState({
    webinar: false,
    kompetisi: false,
    official: false,
    thismonth: false,
    cheap: false,
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
    console.log(search);
  };

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

  const handleFilter = (e) => {
    e.preventDefault();
    filterData(e);
    history.push(
      `?webinar=${filter.webinar}&kompetisi=${filter.kompetisi}&official=${filter.official}&thismonth=${filter.thismonth}&cheap=${filter.cheap}`
    );
  };
  return (
    <>
      <MainLayout top={true}>
        <div className="mt-12 mx-4 md:mx-12">
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-12">
            <MainButton
              type="button"
              className="mb-4 block md:hidden"
              label={`${hidden ? "Tampilkan" : "Sembunyikan"} Filter`}
              onClick={() => {
                setHidden(hidden ? false : true);
              }}
            />
            <div className={`md:col-span-1 md:block ${hidden ? `hidden` : ``}`}>
              <form onSubmit={handleFilter}>
                <h2 className="font-semibold text-2xl mb-12 border-b pb-2">
                  Filter
                </h2>
                <div className="first border-b my-2 pb-2">
                  <Checkbox
                    label="Webinar"
                    onChange={(e) => {
                      setFilter({ ...filter, webinar: e.target.checked });
                    }}
                  />
                  <Checkbox
                    label="Kompetisi"
                    onChange={(e) => {
                      setFilter({ ...filter, kompetisi: e.target.checked });
                    }}
                  />
                </div>
                <div className="second border-b my-2 pb-2">
                  <Checkbox
                    label="Official Organization"
                    onChange={(e) => {
                      setFilter({ ...filter, official: e.target.checked });
                    }}
                  />
                </div>
                <div className="third border-b mb-12 pb-2">
                  <Checkbox
                    label="Bulan ini"
                    onChange={(e) => {
                      setFilter({ ...filter, thismonth: e.target.checked });
                    }}
                  />
                </div>
                <h2 className="font-semibold text-2xl mb-12 border-b pb-2">
                  Urutkan
                </h2>
                <div className="third border-b my-2 pb-2">
                  <Checkbox
                    label="Paling murah"
                    onChange={(e) => {
                      setFilter({ ...filter, cheap: e.target.checked });
                    }}
                  />
                </div>
                <MainButton
                  type="submit"
                  className="mb-4 w-full"
                  label={`Terapkan`}
                  onClick={() => {
                    setHidden(hidden ? false : true);
                  }}
                />
              </form>
            </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-2">
                  {loading ? (
                    <>
                      <MainTicketBar loading={loading} />
                      <MainTicketBar loading={loading} />
                      <MainTicketBar loading={loading} />
                      <MainTicketBar loading={loading} />
                    </>
                  ) : (
                    event.map((item, i) => (
                      <MainTicketBar data={item} key={i} loading={loading} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};
export default SearchEvent;

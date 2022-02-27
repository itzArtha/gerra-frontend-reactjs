import MainLayout from "../../layouts/MainLayout";
import Checkbox from "../../Checkbox";
import MainSearchBarWithSelect from "../../MainSearchBarWithSelect";
import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import MainOrganizationBar from "./components/MainOrganizationBar";
import MainButton from "../../MainButton";
import apiClient from "../../services/apiClient";

const SearchOrganization = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);
  const [filter, setFilter] = useState({
    eventOngoing: false,
    official: false,
    lastUpdate: false,
    ticketSale: false,
  });
  const [hidden, setHidden] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const callback = useCallback((search) => {
    setSearch(search);
  }, []);
  const lastPath = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const filteredOrgs = data.filter((org) => {
    return org.name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [setData]);

  const fetchData = () => {
    apiClient
      .get("/api/v1/organization/all")
      .then((response) => {
        setLoading(false);
        setData(response.data.data);
      })
      .catch((error) => {
        //
      });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    history.push(
      `?eventOngoing=${filter.eventOngoing}&lastUpdate=${filter.lastUpdate}&ticketSale=${filter.ticketSale}`
    );
  };
  return (
    <MainLayout top={true}>
      <div className="mt-12 mx-4 md:mx-12">
{/*        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-12">
          <MainButton
            type="button"
            className="mb-4 md:hidden"
            label={`${hidden ? "Tampilkan" : "Sembunyikan"} Filter`}
            onClick={() => {
              setHidden(hidden ? false : true);
            }}
          />*/}
{/*          <div className={`md:col-span-1 md:block ${hidden ? `hidden` : ``}`}>
            <form onSubmit={handleFilter}>
              <h2 className="font-semibold text-2xl mb-12 border-b pb-2">
                Filter
              </h2>
              <div className="first border-b mb-12 pb-2">
                <Checkbox
                  label="Lagi Ngadain Event"
                  name="eventOngoing"
                  onChange={(e) => {
                    setFilter({ ...filter, eventOngoing: e.target.checked });
                  }}
                />
              </div>
              <h2 className="font-semibold text-2xl mb-12 border-b pb-2">
                Urutkan
              </h2>
              <div className="third border-b mb-12 pb-2">
                <Checkbox
                  label="Terakhir Update"
                  onChange={(e) => {
                    setFilter({ ...filter, lastUpdate: e.target.checked });
                  }}
                />
                <Checkbox
                  label="Tiket Terjual"
                  onChange={(e) => {
                    setFilter({ ...filter, ticketSale: e.target.checked });
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
          </div>*/}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {loading ? (
                  <>
                    <MainOrganizationBar loading={loading} />
                    <MainOrganizationBar loading={loading} />
                    <MainOrganizationBar loading={loading} />
                  </>
                ) : (
                  filteredOrgs.map((item, i) => (
                    <MainOrganizationBar
                      data={item}
                      key={i}
                      loading={loading}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      {/*</div>*/}
    </MainLayout>
  );
};
export default SearchOrganization;

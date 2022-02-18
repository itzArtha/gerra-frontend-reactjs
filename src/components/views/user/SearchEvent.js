import MainLayout from "../../layouts/MainLayout";
import Checkbox from "../../Checkbox";
import MainTicketBar from "./components/MainTicketBar";
import MainSearchBarWithSelect from "../../MainSearchBarWithSelect";
import {useState, useCallback, useEffect} from "react";
import {useLocation, useHistory} from "react-router-dom";
import MainButton from "../../MainButton";
import apiClient from "../../services/apiClient";
import isUser from "../../services/isUser";

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
    }

    const handleFilter = (e) => {
        e.preventDefault();
        filterData(e);
        history.push(
            `?seminar=${filter.seminar}&kompetisi=${filter.kompetisi}&newest=${filter.newest}&thismonth=${filter.thismonth}&mostViewed=${filter.mostViewed}`
        );
    };
    return (
        <>
            <MainLayout top={true}>
                <div className="mt-12 mx-4 md:mx-12">
{/*                    <div className="grid grid-cols-1 md:grid-cols-4 md:gap-12">
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
                                <div className="first border-b mb-12 pb-2">
                                    <Checkbox
                                        label="Seminar"
                                        onChange={(e) => {
                                            setFilter({...filter, seminar: e.target.checked});
                                        }}
                                    />
                                    <Checkbox
                                        label="Kompetisi"
                                        onChange={(e) => {
                                            setFilter({...filter, kompetisi: e.target.checked});
                                        }}
                                    />
                                </div>
                                <h2 className="font-semibold text-2xl mb-12 border-b pb-2">
                                    Urutkan
                                </h2>
                                <div className="third border-b mb-12 pb-2">
                                    <Checkbox
                                        label="Paling baru"
                                        onChange={(e) => {
                                            setFilter({...filter, newest: e.target.checked});
                                        }}
                                    />
                                    <Checkbox
                                        label="Paling banyak dilihat"
                                        onChange={(e) => {
                                            setFilter({...filter, mostViewed: e.target.checked});
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
                                <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-4 gap-2">
                                    {loading ? (
                                        <>
                                            <MainTicketBar loading={loading}/>
                                            <MainTicketBar loading={loading}/>
                                            <MainTicketBar loading={loading}/>
                                            <MainTicketBar loading={loading}/>
                                            <MainTicketBar loading={loading}/>
                                        </>
                                    ) : (
                                        filteredEvents.map((item, i) => (
                                            <MainTicketBar data={item} key={i} loading={loading}/>
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

import SecondaryButton from "../../../SecondaryButton";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "../../../Skeleton";
import { useState } from "react";
const Sidebar = ({ sidebarOpen, setSidebarOpen, route, data, loading }) => {
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  return (
    <>
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 md:hidden md:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>
      <div
        className={`flex flex-col fixed z-40 left-0 top-0 md:left-auto md:top-auto md:translate-x-0 transform h-screen overflow-y-scroll md:overflow-y-auto no-scrollbar w-64 lg:w-72 flex-shrink-0 bg-white p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Close button */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
        <div className="flex flex-col justify-between flex-1 mt-12 md:mt-24">
          <nav>
            <div className="mb-2 last:mb-0">
              <Link to="announcements">
                <SecondaryButton
                  className={`w-full py-4 ${
                    route.includes("announcements") && "bg-yellow-400"
                  }`}
                  label={"Pengumuman"}
                />
              </Link>
            </div>
            <div className="mb-2 last:mb-0">
              <Link to="transactions">
                <SecondaryButton
                  className={`w-full py-4 ${
                    route.includes("transactions") && "bg-yellow-400"
                  }`}
                  label={"Transaksi"}
                />
              </Link>
            </div>
            <div className="mb-2 last:mb-0">
              <Link to="updates">
                <SecondaryButton
                  className={`w-full py-4 ${
                    route.includes("updates") && "bg-yellow-400"
                  }`}
                  label={"Update"}
                />
              </Link>
            </div>
            <div className="mb-2 last:mb-0">
              <Link to="promotions">
                <SecondaryButton
                  className={`w-full py-4 ${
                    route.includes("promotions") && "bg-yellow-400"
                  }`}
                  label={"Promo"}
                />
              </Link>
            </div>
          </nav>

          <div className="flex items-center justify-between px-4 -mx-2">
            <div className="text-xl font-semibold text-gray-700">
              <img
                className="w-8 cursor-pointer"
                src={process.env.PUBLIC_URL + "/left-arrow.svg"}
                alt="Icon"
                onClick={() => {
                  history.goBack();
                }}
              />
            </div>
            <div>
              <Link to="/">
                <img
                  className="h-12"
                  src={process.env.PUBLIC_URL + "/logo.png"}
                  alt="avatar"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;

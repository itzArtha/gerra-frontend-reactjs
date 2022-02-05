import React from "react";
import { useHistory } from "react-router-dom";
import RoundedButton from "../../../../RoundedButton";
import apiClient from "../../../../services/apiClient";

function Header({ sidebarOpen, setSidebarOpen }) {
  const history = useHistory();
  const handleLogout = async () => {
    await apiClient.post("/api/v1/logout").then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        history.push("/login");
      }
    });
  };
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 md:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>
          <div>
            <RoundedButton className="w-12 h-12 mx-1">
              <img
                className="w-8 h-8 px-1"
                src={process.env.PUBLIC_URL + "/bell.svg"}
                alt="Icon"
              />
            </RoundedButton>
            <RoundedButton onClick={handleLogout} className="w-12 h-12 mx-1">
              <img
                className="w-8 h-8 px-1"
                src={process.env.PUBLIC_URL + "/logout.svg"}
                alt="Icon"
              />
            </RoundedButton>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { Link, useHistory } from "react-router-dom";
import ProfilePicture from "../ProfilePicture";
import MainButton from "../MainButton";
import RoundedButton from "../RoundedButton";

const TopNav = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(Object);
  const [isAuth, setAuth] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const history = useHistory();
  const path = window.location.pathname;

  useEffect(() => {
    const getData = async () => {
      await apiClient
        .get("api/v1/user")
        .then((response) => {
          setAdmin(false);
          setAuth(true);
          setUser(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            setAdmin(true);
          } else if (error.response.status === 401) {
            setAuth(false);
          }
        });
    };
    setLoading(true);
    getData();
  }, [setUser]);

  return (
    <div>
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="container px-6 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-gray-700">
              {path === "/" ? (
                <Link to="/">
                  <img
                    className="w-32"
                    src={process.env.PUBLIC_URL + "/logo.png"}
                    alt="Icon"
                  />
                </Link>
              ) : (
                <img
                  className="w-8 cursor-pointer"
                  src={process.env.PUBLIC_URL + "/left-arrow.svg"}
                  alt="Icon"
                  onClick={() => {
                    history.goBack();
                  }}
                />
              )}
            </div>
            {isAdmin ? (
              ""
            ) : isAuth ? (
              <div className="flex">
                <div>
                  <ProfilePicture
                    transform="w-12 h-12 mx-1"
                    link="/profile/biodata"
                    data={user}
                    loading={loading}
                  />
                </div>
              </div>
            ) : (
              <MainButton
                onClick={() => {
                  history.push("/login");
                }}
                label="Login"
              />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default TopNav;

import React, { useState } from "react";
import SecondaryButton from "../../SecondaryButton";
import Notifikasi from "./components/settings/Notifikasi";
import Profile from "./components/settings/Profile";
import Rekening from "./components/settings/Rekening";
import Security from "./components/settings/Security";
import { useLocation, useHistory } from "react-router-dom";

const Setting = ({ data, loading }) => {
  const [isLoading, setLoading] = useState(loading);
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  const query = useQuery();
  const tab = query.get("tab");
  const [status, setStatus] = useState(tab);
  const history = useHistory();

  const handleRedirection = (e) => {
    setStatus(e);
    history.push(`?tab=${e}`);
  };

  if (!tab) {
    handleRedirection("informasi");
  }

  const handleContent = () => {
    switch (status) {
      case "informasi":
        return <Profile data={data} loading={isLoading} />;
        break;
      case "rekening":
        return <Rekening data={data} loading={isLoading} />;
        break;
      case "keamanan":
        return <Security data={data} loading={isLoading} />;
        break;
      case "notifikasi":
        return <Notifikasi data={data} loading={isLoading} />;
        break;
      default:
        history.push("./dashboard");
        break;
    }
  };
  return (
    <>
      <div className="overflow-x-auto whitespace-nowrap overscroll-contain mt-4">
        <div className="webkit-inline-box md:flex">
          <SecondaryButton
            className={`mt-4 mx-1 ${
              status.includes("informasi") && "bg-yellow-400"
            }`}
            type="button"
            onClick={() => {
              handleRedirection("informasi");
            }}
            label="Informasi Organisasi"
          />
          <SecondaryButton
            onClick={() => {
              handleRedirection("rekening");
            }}
            className={`mt-4 mx-1 ${
              status.includes("rekening") && "bg-yellow-400"
            }`}
            type="button"
            label="Informasi Rekening"
          />
          <SecondaryButton
            onClick={() => {
              handleRedirection("keamanan");
            }}
            className={`mt-4 mx-1 ${
              status.includes("keamanan") && "bg-yellow-400"
            }`}
            type="button"
            label="Keamanan"
          />
          <SecondaryButton
            onClick={() => {
              handleRedirection("notifikasi");
            }}
            className={`mt-4 mx-1 ${
              status.includes("notifikasi") && "bg-yellow-400"
            }`}
            type="button"
            label="Notifikasi"
          />
        </div>
      </div>
      <div className="mt-12">{handleContent()}</div>
    </>
  );
};
export default Setting;

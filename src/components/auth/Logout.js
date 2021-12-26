import apiClient from "../services/apiClient";
import { useHistory } from "react-router-dom";
import MainButton from "../MainButton";
import React, { useState } from "react";

const Logout = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState();
  const handleLogout = async () => {
    setLoading(true);
    await apiClient.post("/api/v1/logout").then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        setLoading(false);
        history.push("/login");
      }
    });
  };

  return (
    <React.Fragment>
      <MainButton
        label={isLoading ? "Loading.." : "Logout"}
        type="button"
        disabled={false}
        onClick={() => {
          handleLogout();
        }}
      />
    </React.Fragment>
  );
};
export default Logout;

import apiClient from "./apiClient";

const isAdmin = async () => {
  await apiClient.get("api/v1/check/auth").then((response) => {
    if (response.data === 201) {
      window.location.pathname = "/";
    } else if (response.data === 401) {
      window.location.pathname = "/login";
    }
  });
};
export default isAdmin;

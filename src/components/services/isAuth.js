import apiClient from "./apiClient";

const isAuth = async () => {
  await apiClient.get("api/v1/check/auth").then((response) => {
    if (response.data === 200) {
      window.location.pathname = "/complete-profile";
    } else if (response.data === 201) {
      window.location.pathname = "/";
    }
  });
};
export default isAuth;

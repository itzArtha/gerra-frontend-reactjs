import apiClient from "./apiClient";

const isAuth = (needStatus = false) => {
  return apiClient.get("api/v1/check/auth").then((response) => {
    if (needStatus) {
      if (response.data === 200) {
        window.location.pathname = "/complete-profile";
      } else if (response.data === 201) {
        window.location.pathname = "/";
      }
    } else {
      return response.status;
    }
  });
};
export default isAuth;

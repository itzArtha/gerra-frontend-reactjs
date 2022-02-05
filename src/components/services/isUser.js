import apiClient from "./apiClient";

const isUser = async () => {
  await apiClient.get("api/v1/check/auth").then((response) => {
    if (response.data === 200) {
      window.location.pathname = "/complete-profile";
    } else if (response.data === 401) {
      window.location.pathname = "/login";
    }
  });
};
export default isUser;

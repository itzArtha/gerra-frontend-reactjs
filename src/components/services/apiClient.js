import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.REACT_APP_ENV === "local"
      ? process.env.REACT_APP_API_BASE_URL_DEV
      : process.env.REACT_APP_API_BASE_URL_PROD,
  withCredentials: true,
});

export default apiClient;

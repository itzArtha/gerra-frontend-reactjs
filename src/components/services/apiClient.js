import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.APP_ENV == "local"
      ? "http://localhost:8000"
      : process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

export default apiClient;

import axios from "axios";

let baseUrl = process.env.REACT_APP_API_BASE_URL_DEV;

if (process.env.REACT_APP_ENV === "production") {
  baseUrl = process.env.REACT_APP_API_BASE_URL_PROD;
} else if (process.env.REACT_APP_ENV === "staging") {
  baseUrl = process.env.REACT_APP_API_BASE_URL_STAGING;
}

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default apiClient;

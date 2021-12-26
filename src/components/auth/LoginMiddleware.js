import apiClient from "../services/apiClient";
import { useHistory } from "react-router-dom";

const LoginMiddleware = apiClient
  .get("api/v1/check/auth")
  .then((response) => {
    console.log(response);
    const history = useHistory();
    if (response.data === true) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      return history.push("/login");
    }
  })
  .catch((error) => {
    console.log(error);
  });

export default LoginMiddleware;

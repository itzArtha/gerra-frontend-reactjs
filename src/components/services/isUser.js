import apiClient from "./apiClient";
import handleSwal from "../handleSwal";

const isUser = async () => {
    await apiClient.get("api/v1/check/auth").then((response) => {
        if (response.data === 200) {
            window.location.pathname = "/complete-profile";
        } else if (response.data === 401) {
            if (window.location.pathname === "/") {
                // handleSwal("Silakan login terlebih dahulu", "error")
            } else {
                window.location.pathname = "/login";
            }
        }
    });
};
export default isUser;

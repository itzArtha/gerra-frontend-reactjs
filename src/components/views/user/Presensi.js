import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import MainButton from "../../MainButton";
import apiClient from "../../services/apiClient";
import useQuery from "../../useQuery";
import PresenceMode from "./components/PresenceMode";
import PresenceUnknownMode from "./components/PresenceUnknownMode";

const Presensi = () => {
  const [status, setStatus] = useState("");
  const history = useHistory();
  const { slug } = useParams();

  const callback = useCallback(() => {
    checkPresence();
  }, []);

  const checkPresence = async () => {
    await apiClient
      .get("/api/v1/user/presence/" + slug)
      .then((response) => {
        if (response.status === 200) {
          setStatus("success");
          history.push("?status=success");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setStatus("unknown");
        } else if (error.response.status === 404) {
          setStatus("presence");
        }
      });
  };

  useEffect(() => {
    checkPresence();
  }, [slug]);

  return (
    <>
      <div>
        {status === "" ? (
          <div className="flex justify-center my-12">
            <span>Loading...</span>
          </div>
        ) : status === "success" || status === "presence" ? (
          <PresenceMode clickCallback={callback} status={status} slug={slug} />
        ) : (
          <PresenceUnknownMode />
        )}
      </div>
    </>
  );
};
export default Presensi;

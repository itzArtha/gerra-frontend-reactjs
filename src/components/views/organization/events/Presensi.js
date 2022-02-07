import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainButton from "../../../MainButton";
import SecondaryButton from "../../../SecondaryButton";
import apiClient from "../../../services/apiClient";
import Skeleton from "../../../Skeleton";
import DetailPresensi from "../components/DetailPresensi";
import TablePresensi from "../components/TablePresensi";

const Presensi = () => {
  const [status, setStatus] = useState("detail");
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [presence, setPresence] = useState();
  const { slug } = useParams();

  useEffect(() => {
    fetchPresence();
  }, []);

  const fetchPresence = () => {
    setLoading(true);
    apiClient
      .get("/api/v1/presence/" + slug + "/edit")
      .then((response) => {
        setPresence(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const createPresence = () => {
    setBtnLoading(true);
    apiClient
      .post("/api/v1/presence", { event_id: slug })
      .then((response) => {
        if (response.status === 200) {
          fetchPresence();
          setBtnLoading(false);
        }
      })
      .catch((error) => {
        setBtnLoading(false);
      });
  };

  return (
    <>
      {!presence ? (
        loading ? (
          <span className="flex justify-center mt-12">Loading...</span>
        ) : (
          <div>
            <div className="flex justify-center">
              <img
                className="md:w-1/3 w-full"
                src={process.env.PUBLIC_URL + "/welcome.svg"}
                alt="Icon"
              />
            </div>
            <div className="flex justify-center my-8 text-center">
              <span>
                "Kamu harus membuat presensi dulu untuk buat link presensi"
              </span>
            </div>
            <div className="flex justify-center mt-8">
              <MainButton
                className="md:w-1/4 w-full"
                onClick={createPresence}
                label={btnLoading ? `Loading...` : `Buat Presensi`}
              />
            </div>
          </div>
        )
      ) : (
        <div>
          <div className="py-4">
            <div className="my-4 flex gap-2 justify-start">
              <div title="Detail">
                {status === "detail" ? (
                  <MainButton label="Detail & QR" />
                ) : (
                  <SecondaryButton
                    onClick={() => {
                      setStatus("detail");
                    }}
                    label="Detail & QR"
                  />
                )}
              </div>
              <div title="Presensi">
                {status === "presensi" ? (
                  <MainButton label="Data Presensi" />
                ) : (
                  <SecondaryButton
                    onClick={() => {
                      setStatus("presensi");
                    }}
                    label="Data Presensi"
                  />
                )}
              </div>
            </div>
          </div>
          {status === "detail" ? (
            <DetailPresensi eventSlug={slug} data={presence} />
          ) : (
            <div title="Tables">
              <div className="my-4 flex gap-2 justify-end">
                <MainButton label="Export Data" />
              </div>
              <div title="table" className="my-4">
                <TablePresensi />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Presensi;

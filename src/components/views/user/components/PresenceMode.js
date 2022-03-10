import { useEffect, useRef, useState } from "react";
import MainButton from "../../../MainButton";
import SignaturePad from "react-signature-canvas";
import Label from "../../../Label";
import apiClient from "../../../services/apiClient";
import handleSwal from "../../../handleSwal";
import moment from "moment";
import Skeleton from "../../../Skeleton";

const PresenceMode = ({ status, slug, clickCallback }) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [data, setData] = useState({});
  const sigCanvas = useRef({});

  const fetchData = async () => {
    setLoading(true);
    await apiClient.get("/api/v1/presence/" + slug).then((response) => {
      setData(response.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = () => {
    const urlSig = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setImageURL(urlSig);
    handleSwal("Mantapp gan!");
  };
  const clear = () => {
    sigCanvas.current.clear();
    setImageURL(null);
  };

  const handlePresence = () => {
    if (imageURL !== null && data.is_need_signature) {
      addPresence();
    } else if (!data.is_need_signature) {
      addPresence();
    } else {
      handleSwal("Jangan lupa tanda tangan dong, bby </3", "warning");
    }
  };

  const addPresence = async () => {
    setBtnLoading(true);
    await apiClient
      .post("/api/v1/user/presence", {
        signature: imageURL,
        slug: slug,
      })
      .then((response) => {
        handleSwal(response.data.message);
        clickCallback();
        setBtnLoading(false);
      })
      .catch((error) => {
        handleSwal(error.response.data.message);
        setBtnLoading(false);
      });
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto text-center">
          <h2 className="font-light text-xl">
            {status === "success"
              ? "Presensi berhasil!"
              : "Silakan lakukan presensi"}
          </h2>
          <h2 className="font-bold text-2xl mb-8 mt-2">
            {loading ? "Loading..." : data.eventName}
          </h2>
          <div>
            <div className="flex justify-center my-2">
              {loading ? (
                <Skeleton className="w-36 h-36 rounded-full" count="1" />
              ) : (
                <img
                  className="w-36 h-36 object-cover rounded-full"
                  src={data.photo_url}
                  alt=""
                />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-xl">
                {loading ? "Loading..." : data.userName}
              </h2>
            </div>
            <div className="my-2">
              <span className="font-light text-base">
                Waktu sekarang : {moment().format("MMM Do YY, h:mm a")}
              </span>
            </div>
            {data.is_need_signature && status === "presence" ? (
              <div className="py-2">
                {loading ? (
                  <Skeleton className="w-24 h-4 rounded" count="1" />
                ) : (
                  <Label className="flex justify-start" label="Tanda tangan" />
                )}
                {loading ? (
                  <Skeleton className="w-full h-36 rounded" count="1" />
                ) : (
                  <SignaturePad
                    ref={sigCanvas}
                    canvasProps={{
                      className: "border p-2 w-full h-36",
                    }}
                  />
                )}
                {loading ? (
                  ""
                ) : (
                  <div className="flex gap-2">
                    <MainButton
                      className="w-full mt-2"
                      onClick={() => {
                        clear();
                      }}
                      label="Hapus"
                    />
                    <MainButton
                      className="w-full mt-2"
                      onClick={() => {
                        save();
                      }}
                      label="Simpan"
                    />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>

          {data.is_share_certificate && status === "success" ? (
            <MainButton
              className="my-4"
              onClick={() => {
                window.location.href = data.certificates;
              }}
              label="Download Sertifikat"
            />
          ) : status === "success" ? (
            <MainButton
              className="my-4"
              onClick={() => {
                window.location.href = "/";
              }}
              label="Yuk pulang!"
            />
          ) : (
            ""
          )}
          {status === "presence" ? (
            <div className="mt-12">
              {loading ? (
                <Skeleton className="w-full h-10 rounded" count="1" />
              ) : (
                <MainButton
                  onClick={() => {
                    handlePresence();
                  }}
                  className="w-full"
                  label={btnLoading ? "Loading..." : "Hadir!"}
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default PresenceMode;

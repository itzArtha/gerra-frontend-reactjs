import InfoModal from "../../../../modals/InfoModal";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";
import apiClient from "../../../../services/apiClient";
import register from "../../../../auth/Register";

const ScanQR = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showParticipant, setShowParticipant] = useState({
    condition: false,
    message: "",
    registered: false,
  });
  const [data, setData] = useState({});

  let [count, setCount] = useState("readyScan");

  const handleStopScan = () => {
    setShowScanner(false);
    getElementIdScanner()
      .stop()
      .then((ignore) => {
        setShowScanner(false);
      })
      .catch((err) => {
        setShowScanner(false);
      });
  };

  const getElementIdScanner = () => new Html5Qrcode("reader");

  const handleScan = () => {
    setShowScanner(true);
    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          let cameraId = devices[0].id;

          getElementIdScanner()
            .start(
              { facingMode: "environment" },
              {
                fps: 10, // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
              },
              (decodedText, decodedResult) => {
                decodedText = JSON.parse(decodedText);

                if (count === "readyScan") {
                  setCount("scanned");
                  handlePresenceRequest(decodedText);
                }
              },
              (errorMessage) => {
                // console.log(errorMessage);
              }
            )
            .catch((err) => {
              // Start failed, handle it.
            });
        }
      })
      .catch((err) => {
        // handle err
      });
  };

  const handleBackParticipant = () => {
    setCount("readyScan");
    setShowParticipant({ condition: false, message: "", registered: false });
  };

  const handlePresenceRequest = (decodedText) => {
    apiClient
      .post("/api/v1/user/presence", {
        event_id: decodedText.event_id,
        participant_id: decodedText.participant_id,
      })
      .then((response) => {
        setData(response.data.data);
        setShowParticipant({
          message: "Peserta terdaftar",
          condition: true,
          registered: true,
        });
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setShowParticipant({
            message: "Peserta tidak terdaftar",
            condition: true,
            registered: false,
          });
        } else if (err.response.status === 401) {
          setShowParticipant({
            message: "Peserta sudah masuk event",
            condition: true,
            registered: false,
          });
        }
      });
  };

  return (
    <div className="h-24 p-2 md:mb-20 mb-12 fixed w-full z-10 bottom-0 flex justify-center">
      {showScanner ? (
        <InfoModal
          title={`Scan QR Code`}
          handleClose={() => {
            handleStopScan();
          }}
          showModal={showScanner}
        >
          <div id="reader" width="600px">
            Loading...
          </div>
        </InfoModal>
      ) : (
        ""
      )}

      <InfoModal
        title={showParticipant.message}
        handleClose={() => {
          handleBackParticipant();
        }}
        showModal={showParticipant.condition}
      >
        <div className={"text-center"}>
          {showParticipant.registered ? (
            <div>
              <img
                className={"w-24 h-24 mx-auto"}
                src={data.photoUrl}
                alt={data.name}
              />
              <div className={"mt-4"}>
                <p>
                  Halo <b>{data.name}</b>, Silakan masuk
                </p>
              </div>
            </div>
          ) : (
            <div>{showParticipant.message}</div>
          )}
        </div>
      </InfoModal>

      <div title="Scan" className="text-center cursor-pointer md:mx-2 mx-1">
        <div
          onClick={() => {
            handleScan();
          }}
          className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:p-6 p-3 md:h-24 md:w-24 h-16 w-16 md:mx-2 mx-1 border-black border-2"
        >
          <img
            className="w-18 h-18"
            src={process.env.PUBLIC_URL + "/qr-code.svg"}
            alt="Icon"
          />
        </div>
        <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:py-1 px-2 mt-2 border-black border">
          <span className="md:text-sm text-xs font-semibold">Scan</span>
        </div>
      </div>
    </div>
  );
};
export default ScanQR;

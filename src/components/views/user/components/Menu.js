import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import { QrReader } from "react-qr-reader";
import InfoModal from "../../../modals/InfoModal";

const Menu = () => {
  const [countNotif, setCountNotif] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [dataScan, setDataScan] = useState(false);
  const [isAuth, setAuth] = useState(false);
  useEffect(() => {
    const countNotif = () => {
      apiClient
        .get("/api/v1/user/count/notifications")
        .then((response) => {
          setCountNotif(response.data.data);
          setAuth(true);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setAuth(false);
          }
        });
    };
    countNotif();
  }, [setCountNotif]);

  const handleScan = (result) => {
    console.log(result);
  };

  return (
    <>
      {showScanner ? (
        <InfoModal
          title={`Scan QR Code`}
          handleClose={() => {
            setShowScanner(false);
          }}
          showModal={showScanner}
        >
          <QrReader
            scanDelay={100}
            onResult={(result, error) => {
              if (!!result) {
                console.log(result?.text);
              }

              if (!!error) {
                // console.info(error);
              }
            }}
            showViewFinder={true}
            style={{ width: "100%" }}
            constraints={{
              facingMode: "environment",
            }}
          />
        </InfoModal>
      ) : (
        ""
      )}

      <div className="h-24 p-2 md:mb-20 mb-12 fixed w-full z-10 bottom-0 flex justify-center">
        <div title="Home" className="text-center cursor-pointer md:mx-2 mx-1">
          <Link to="/">
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:pl-4 md:pr-4 md:pt-3 px-2 h-12 w-12 md:h-20 md:w-20 md:mx-2 mx-1 border-black border-2">
              <img
                className="w-12 h-12"
                src={process.env.PUBLIC_URL + "/home.svg"}
                alt="Icon"
              />
            </div>
            <div className="rounded-full shadow-lg bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:py-1 px-2 mt-2 border-black border">
              <span className="md:text-sm text-xs font-semibold">Home</span>
            </div>
          </Link>
        </div>
        <div
          title="Explore"
          className="text-center cursor-pointer md:mx-2 mx-1"
        >
          <Link to="/explore/event">
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:p-4 pb-4 px-2 h-12 w-12 md:h-20 md:w-20  md:mx-2 mx-1 border-black border-2">
              <img
                className="w-12 h-12"
                src={process.env.PUBLIC_URL + "/explore.svg"}
                alt="Icon"
              />
            </div>
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:py-1 px-2 mt-2 border-black border">
              <span className="md:text-sm text-xs font-semibold">Explore</span>
            </div>
          </Link>
        </div>
        {/*<div title="Scan" className="text-center cursor-pointer md:mx-2 mx-1">
          <div
            onClick={() => {
              setShowScanner(true);
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
        </div>*/}
        <div title="Tiket" className="text-center cursor-pointer md:mx-2 mx-1">
          <Link to={!isAuth ? "/login" : "/tickets/all-tickets"}>
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:p-4 pb-2 px-2 h-12 w-12 md:h-20 md:w-20  md:mx-2 mx-1 border-black border-2">
              <img
                className="w-12 h-12"
                src={process.env.PUBLIC_URL + "/ticket.svg"}
                alt="Icon"
              />
            </div>
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:py-1 px-2 mt-2 border-black border">
              <span className="md:text-sm text-xs font-semibold">Tiket</span>
            </div>
          </Link>
        </div>
        <div title="Notif" className="text-center cursor-pointer md:mx-2 mx-1">
          <Link to={!isAuth ? "/login" : "/notifications/announcements"}>
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:p-4 pb-2 px-2 h-12 w-12 md:h-20 md:w-20 md:mx-2 mx-1 border-black border-2">
              <img
                className="w-12 h-12"
                src={process.env.PUBLIC_URL + "/bell.svg"}
                alt="Icon"
              />
              <div className="top-0 right-0 md:h-8 md:w-8 w-6 h-6 align-top bg-purple-500 rounded-full border border-black absolute">
                <span className="font-semibold text-white md:text-lg text-xs">
                  {countNotif}
                </span>
              </div>
            </div>
            <div className="shadow-lg rounded-full bg-yellow-400 duration-200 transform hover:bg-yellow-300 md:py-1 px-2 mt-2 border-black border">
              <span className="md:text-sm text-xs font-semibold">Notif</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
export default Menu;

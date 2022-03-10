import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";

const OverlayPresensi = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    name: "",
    eventName: "",
    photoUrl: "",
  });
  const { slug } = useParams();

  useEffect(() => {
    const pusher = new Pusher("b97c818f3ea7eb3a15fe", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe(`overlay.${slug}`);
    channel.bind("overlayHandler", (data) => {
      setData({
        name: data.data.name,
        eventName: data.data.eventName,
        photoUrl: data.data.photoUrl,
      });
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    });
  }, []);

  const getDay = () => {
    let result = "";
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      result = "pagi";
    } else if (hours >= 12 && hours < 16) {
      result = "siang";
    } else if (hours >= 16 && hours < 18) {
      result = "sore";
    } else {
      result = "malam";
    }
    return result;
  };

  return (
    <>
      {show ? (
        <div
          title="Example Overlay"
          className="flex h-screen transition-opacity duration-300"
          onTransitionEnd={() => setShow(false)}
        >
          <div className="p-4 m-auto">
            <div className="flex justify-center">
              <img
                className="w-40 h-40 rounded-full object-cover"
                src={data.photoUrl}
                alt="Profile"
              />
            </div>
            <div className="flex justify-center my-4">
              <div className="border-2 border-black bg-yellow-400 rounded p-4 w-full">
                <h2 className="font-semibold text-4xl text-center leading-relaxed">
                  Selamat {getDay()} {data.name}, <br /> dan selamat datang di
                  acara {data.eventName}
                  <br />
                </h2>
                <span className="font-light text-3xl flex justify-center leading-relaxed">
                  Jangan lupa overthinking 😘
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default OverlayPresensi;

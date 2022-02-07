import { useEffect, useState } from "react";
import Pusher from "pusher-js";

const OverlayPresensi = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    name: "",
    eventName: "",
  });

  useEffect(() => {
    const pusher = new Pusher("b97c818f3ea7eb3a15fe", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("overlay.1");
    channel.bind("overlayHandler", (data) => {
      setData({ name: data.data.name, eventName: data.data.eventName });
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    });
  }, []);

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
                src="https://images.unsplash.com/photo-1640057692320-c88208a4c832?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Profile"
              />
            </div>
            <div className="flex justify-center my-4">
              <div className="border-2 border-black bg-yellow-400 rounded p-4 w-full">
                <h2 className="font-semibold text-4xl text-center leading-relaxed">
                  Selamat pagi {data.name}, <br /> dan selamat datang di acara{" "}
                  {data.eventName}
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

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Checkbox from "../../../../Checkbox";
import apiClient from "../../../../services/apiClient";
import Skeleton from "../../../../Skeleton";

const Notifikasi = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [notif, setNotif] = useState([]);

  const notifArr = (value) => {
    return [
      {
        name: "waiting_payment",
        title: "Menunggu Pembayaran",
        value: value.waiting_payment,
      },
      {
        name: "payment_success",
        title: "Pembayaran Berhasil",
        value: value.payment_success,
      },
      {
        name: "payment_failed",
        title: "Pembayaran Gagal",
        value: value.payment_failed,
      },
      {
        name: "event_ended",
        title: "Event Berakhir",
        value: value.event_ended,
      },
      {
        name: "event_started",
        title: "Event Dimulai",
        value: value.event_started,
      },
      {
        name: "event_attended",
        title: "Event Dihadiri",
        value: value.event_attended,
      },
      {
        name: "reminder",
        title: "Pengingat",
        value: value.reminder,
      },
      {
        name: "announcement",
        title: "Pengumuman",
        value: value.announcement,
      },
      {
        name: "chat",
        title: "Chat",
        value: value.chat,
      },
      {
        name: "newsletter",
        title: "Newsletter",
        value: value.newsletter,
      },
    ];
  };

  useEffect(
    (history) => {
      const fetchData = async () => {
        setLoading(true);
        await apiClient
          .get("/api/v1/notifications")
          .then((response) => {
            setNotif(notifArr(response.data.data));
            setLoading(false);
          })
          .catch((error) => {
            if (error.response.status === 421) {
              history.push("/login");
            }
          });
      };
      fetchData();
    },
    [setNotif]
  );

  const updateData = async (data) => {
    await apiClient
      .put("/api/v1/notifications", data)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        //
      });
  };

  const handleUpdate = (i) => (e) => {
    const newArray = [...notif];
    newArray[i] = {
      name: e.target.name,
      title: e.target.title,
      value: e.target.checked,
    };
    const updatedData = {
      [e.target.name]: e.target.checked,
    };
    updateData(updatedData);
    setNotif(newArray);
  };

  return (
    <>
      <div className="m-4">
        {isLoading ? (
          <Skeleton className="w-full h-14 rounded" count="1" />
        ) : (
          <div
            className="bg-green-100 rounded-b text-green-600 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex justify-center">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div className="mt-1">
                <p className="font-semibold">
                  Notifikasi sangat penting untuk kamu agar tidak terlewat hal
                  penting
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-12">
          {notif.map((item, i) => (
            <div className="flex justify-between mt-2">
              <span className="pt-2">{item.title}</span>
              <span>
                <Checkbox
                  key={i}
                  onChange={handleUpdate(i)}
                  value={item.value}
                  checked={item.value}
                  name={item.name}
                  title={item.title}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Notifikasi;

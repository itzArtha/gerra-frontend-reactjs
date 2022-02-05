import { Link } from "react-router-dom";
import moment from "moment";
import InfoModal from "../../../modals/InfoModal";
import { useState } from "react";
const NotifBar = ({ data, sort, loading, callback }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCallback = (id) => {
    callback(id);
  };

  const handleClick = (id) => {
    setShowModal(true);
    if (!data.read_at) {
      handleCallback(id);
    }
  };

  return (
    <>
      <div>
        <InfoModal
          showModal={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
          title={"Detail Notifikasi"}
        >
          <div className={`p-4 my-2 rounded`}>
            <div className="flex gap-2 mb-2">
              <div title="Time">
                <span className="font-light text-sm">
                  {moment(data.created_at).format("lll")}
                </span>
              </div>
            </div>
            <div title="Title">
              <h2 className="capitalize font-semibold text-lg">
                {JSON.parse(data.data).action_text}
              </h2>
            </div>
            <div title="Content">
              <p className="text-md">{JSON.parse(data.data).body}</p>
            </div>
          </div>
        </InfoModal>
      </div>
      {/* <Link to={data.data.action_url}> */}
      <div
        onClick={() => {
          handleClick(data.id);
        }}
        className={`${
          data.read_at ? "" : "bg-yellow-50"
        } p-4 my-2 rounded cursor-pointer`}
      >
        <div className="flex gap-2 mb-2">
          <div title="Type">
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                sort === "announcements"
                  ? "text-red-600 bg-red-200"
                  : sort === "transactions"
                  ? "text-green-600 bg-green-200"
                  : sort === "updates"
                  ? "text-blue-600 bg-blue-200"
                  : "text-purple-600 bg-purple-200"
              }`}
            >
              {sort === "announcements"
                ? "Pengumuman"
                : sort === "transactions"
                ? "Pembayaran"
                : sort === "updates"
                ? "Info"
                : "Diskon"}
            </span>
          </div>
          <div title="Time">
            <span className="font-light text-sm">
              {moment(data.created_at).format("lll")}
            </span>
          </div>
        </div>
        <div title="Title">
          <h2 className="capitalize font-semibold text-lg">
            {JSON.parse(data.data).action_text}
          </h2>
        </div>
        <div title="Content">
          <p className="text-md">{JSON.parse(data.data).body}</p>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
};
export default NotifBar;

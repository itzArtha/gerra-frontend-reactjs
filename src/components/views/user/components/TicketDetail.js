import IconWithTitle from "../../IconWithTitle";
import RoundedButton from "../../../RoundedButton";
import MainButton from "../../../MainButton";
import InfoModal from "../../../modals/InfoModal";
import { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
const TicketDetail = ({ transaction, loading, type }) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const data = transaction.ticket;
  return (
    <>
      <InfoModal
        showModal={showTicketModal}
        handleClose={() => {
          setShowTicketModal(false);
        }}
        title={"Detail Tiket"}
      >
        <div>
          <tr className="flex justify-between border-b py-2">
            <td>Nama Tiket</td>
            <td>{data.title}</td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Waktu Mulai</td>
            <td>{moment(data.start_at).format("llll")}</td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Waktu Selesai</td>
            <td>{moment(data.end_at).format("llll")}</td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Invoice Pembelian</td>
            <td className="text-blue-500 hover:text-blue-600 cursor-pointer">
              <a href={transaction.invoice.path}>
                GR-EX-{transaction.created_at.split("T")[0]}-
                {transaction.invoice.id}
              </a>
            </td>
          </tr>
          {data.event.is_online ? (
            <tr className="flex justify-between border-b py-2">
              <td>Link Conference</td>
              <td>
                <a
                  className="text-blue-500 hover:text-blue-600"
                  href="https://www.instagram.com/exotix.id"
                >
                  Klik Link
                </a>
              </td>
            </tr>
          ) : (
            <tr className="flex justify-between border-b py-2">
              <td>Lokasi</td>
              <td>{data.event.location}</td>
            </tr>
          )}
        </div>
      </InfoModal>
      <div className="p-4 border rounded">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <div>
              <span className="text-lg font-semibold">{data.title}</span>
            </div>
            <div>
              <span
                class={`px-3 py-1 text-xs rounded-full ${
                  transaction.status === "pending"
                    ? "text-yellow-600 bg-yellow-200"
                    : transaction.status === "settlement"
                    ? "text-green-600 bg-green-200"
                    : "text-red-600 bg-red-200"
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
          <div>
            <span className="text-lg font-light">
              {moment(data.start_at).format("lll")}
            </span>
          </div>
        </div>
        <div>
          <IconWithTitle
            loading={loading}
            title={data.event.owner.name}
            icon={
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.event.owner.photo_url}
                alt="Icon"
              />
            }
          />
        </div>
        <div>
          <IconWithTitle
            loading={loading}
            title={moment(data.start_at).format("lll")}
            icon={
              <RoundedButton type="button" className="w-8 h-8">
                <img
                  className="w-4 h-4"
                  src={process.env.PUBLIC_URL + "/clock.svg"}
                  alt="Icon"
                />
              </RoundedButton>
            }
          />
        </div>
        <div className="flex justify-between">
          <div>
            <IconWithTitle
              loading={loading}
              title={data.event.location}
              icon={
                <RoundedButton type="button" className="w-8 h-8">
                  <img
                    className="w-4 h-4"
                    src={process.env.PUBLIC_URL + "/pin.svg"}
                    alt="Icon"
                  />
                </RoundedButton>
              }
            />
          </div>
          {transaction.status === "pending" ? (
            <div>
              <Link to={transaction.payment.path}>
                <MainButton label="Bayar" />
              </Link>
            </div>
          ) : (
            ""
          )}
          {transaction.status === "settlement" ? (
            <div>
              <MainButton
                onClick={() => {
                  setShowTicketModal(true);
                }}
                label="Lihat Detail Tiket"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default TicketDetail;

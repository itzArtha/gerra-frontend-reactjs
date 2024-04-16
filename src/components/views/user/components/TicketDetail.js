import IconWithTitle from "../../IconWithTitle";
import RoundedButton from "../../../RoundedButton";
import MainButton from "../../../MainButton";
import InfoModal from "../../../modals/InfoModal";
import { useRef, useState } from "react";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
const TicketDetail = ({ participant, loading, type }) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const history = useHistory();
  const transaction = participant.transaction;
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
            <td>Nomor Tiket</td>
            <td>{participant.reference}</td>
          </tr>
          <tr className="flex justify-between border-b py-2">
            <td>Nama Tiket</td>
            <td>{data.title}</td>
          </tr>

          <tr className={"flex justify-center mt-4"}>
            <QRCode
              value={participant.uuid}
              imageSettings={{
                src: process.env.PUBLIC_URL + "/logo-qr.png",
                width: 80,
                height: 80,
              }}
              id="qr-download"
              size={256}
              renderAs="canvas"
            />
          </tr>
          <tr className={"mt-2 text-red-500 flex justify-center text-center"}>
            Silakan Berikan QRCode ini kepada petugas saat akan memasuki event
          </tr>
        </div>
      </InfoModal>
      <div className="p-4 border rounded">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <div>
              <span className="text-lg font-semibold">{data.title}</span>
            </div>
          </div>
          <div>
            <span className="text-xs md:text-base font-light">
              {moment(data.start_at).format("ll")}
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
        </div>
        <div className={"flex justify-between"}>
          <div className={"mt-auto"}>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
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

          <div className={"flex justify-end mt-8"}>
            {transaction.status === "pending" ? (
              <div>
                <a target={"_blank"} href={transaction.payment.path}>
                  <MainButton label="Bayar" />
                </a>
              </div>
            ) : (
              ""
            )}
            {transaction.status === "settlement" ? (
              <div className={"flex gap-2"}>
                {/*<MainButton*/}
                {/*  onClick={() => {*/}
                {/*    history.push("/pdf/ticket/" + transaction.participant_id);*/}
                {/*  }}*/}
                {/*  label={*/}
                {/*    <div>*/}
                {/*      <span className={"block"}>Download</span>*/}
                {/*    </div>*/}
                {/*  }*/}
                {/*/>*/}

                <MainButton
                  onClick={() => {
                    setShowTicketModal(true);
                  }}
                  label={
                    <div>
                      <span className={"block"}>Detail Tiket</span>
                    </div>
                  }
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TicketDetail;

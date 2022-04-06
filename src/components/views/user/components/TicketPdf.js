import Pdf from "react-to-pdf";
import { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";
import MainButton from "../../../MainButton";
import apiClient from "../../../services/apiClient";
import { useParams } from "react-router-dom";
import moment from "moment";
const TicketPdf = () => {
  const pdfRef = useRef(null);
  const [data, setData] = useState({});
  const { ticketId } = useParams();
  useEffect(() => {
    const fetchData = () => {
      apiClient
        .get("/api/v1/user/participant/" + ticketId)
        .then((r) => {
          setData(r.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [ticketId]);
  const ticket = {
    ticketName: data.ticketName,
    ticketNumber: data.participantId,
  };
  const events = [
    {
      title: "Event Title",
      value: data.title,
    },
    {
      title: "Event Organizer",
      value: data.organizer,
    },
    {
      title: "Event Start",
      value: moment(data.startAt).format("lll"),
    },
    {
      title: "Event End",
      value: moment(data.endAt).format("lll"),
    },
  ];
  const participants = [
    {
      title: "Participant ID",
      value: data.participantId,
    },
    {
      title: "Participant Name",
      value: data.participantName,
    },
    {
      title: "Participant Email",
      value: data.participantEmail,
    },
    {
      title: "Ticket Price",
      value: (
        <CurrencyFormat
          value={data.ticketPrice}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
        />
      ),
    },
    {
      title: "Valid Until",
      value: moment(data.validUntil).format("lll"),
    },
  ];
  return (
    <>
      <div className={"m-16 text-center"}>
        <Pdf targetRef={pdfRef} filename={`${data.ticketName}-ticket.pdf`}>
          {({ toPdf }) => (
            <MainButton
              onClick={toPdf}
              label={
                <div>
                  <span className={"hidden lg:block"}>Download PDF</span>
                </div>
              }
            />
          )}
        </Pdf>
      </div>
      <div className={"md:max-w-4xl mx-auto"}>
        <div ref={pdfRef} className={"mt-8 mx-16"}>
          <img
            className={"w-64 mx-auto"}
            src={process.env.PUBLIC_URL + "/logo.png"}
          />
          <div className={"text-center"}>
            <div>
              <span className={"font-semibold text-lg uppercase"}>
                Warung Tiket Mahasiswa Abadi
              </span>
            </div>
            <div>
              <span className={"font-base text-lg uppercase"}>
                Denpasar - Bali | ternakayam.company@gmail.com
              </span>
            </div>
          </div>
          <div className={"my-24"}>
            <span className={"mx-8 font-bold text-xl"}>
              Electronic Ticket Receipt
            </span>
            <div className={"m-8 grid md:grid-cols-4 grid-cols-2 gap-2"}>
              <div>
                <div>
                  <span className={"font-semibold text-blue-600 text-lg"}>
                    Ticket Name
                  </span>
                </div>
                <div className={"border-b border-black"} />
                <div>
                  <span className={"font-semibold text-blue-600 text-lg"}>
                    {ticket.ticketName}
                  </span>
                </div>
              </div>
              <div>
                <div>
                  <span className={"font-semibold text-blue-600 text-lg"}>
                    Ticket Number
                  </span>
                </div>
                <div className={"border-b border-black"} />
                <div>
                  <span className={"font-semibold text-blue-600 text-lg"}>
                    {ticket.ticketNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className={"m-8"}>
              <span className={"font-bold text-blue-700 text-xl"}>Event</span>
              {events.map((item, i) => (
                <div key={i} className={"grid grid-cols-2 gap-2 m-4"}>
                  <div>
                    <span>{item.title}</span>
                  </div>
                  <div>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={"border-b"} />
            <div className={"m-8"}>
              <span className={"font-bold text-blue-700 text-xl"}>
                Participant
              </span>
              {participants.map((item, i) => (
                <div key={i} className={"grid grid-cols-2 gap-2 m-4"}>
                  <div>
                    <span>{item.title}</span>
                  </div>
                  <div>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <footer className="bg-white dark:bg-gray-800 bottom-0 left-0 relative w-full">
            <div className="pt-8 mx-auto">
              <p className="font-semibold text-center bottom-2 left-2 text-xs md:text-base">
                Copyright Tokoevent {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
export default TicketPdf;

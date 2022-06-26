import Skeleton from "../../Skeleton";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import MainLayout from "../../layouts/MainLayout";
import MainTicketBar from "../user/components/MainTicketBar";
import {
  WhatsappIcon,
  WhatsappShareButton,
  LineShareButton,
  LineIcon,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";
import NotFound from "../../errors/NotFound";

const PublicProfileView = () => {
  const { username } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isEventLoading, setEventLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [data, setData] = useState([]);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await apiClient
        .get("api/v1/organization/profile/" + username)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          setError(false);
        })
        .catch((error) => {
          setError(true);
        });
    };

    const fetchEventData = async () => {
      setEventLoading(true);
      await apiClient.get("/api/v1/all/event/" + username).then((response) => {
        setEvent(response.data.data);
        setEventLoading(false);
      });
    };

    fetchData();
    fetchEventData();
  }, [setData]);

  return isError ? (
    <NotFound />
  ) : (
    <MainLayout top={true} footer={true}>
      <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
        <div className="mx-auto">
          <div className="w-full mx-auto xl:mx-0">
            <div
              className={`rounded relative mt-8 h-48  ${
                isLoading ? "bg-gray-200" : ""
              } `}
            >
              {isLoading ? (
                ""
              ) : (
                <img
                  src={
                    data.banner_url
                      ? data.banner_url
                      : process.env.REACT_APP_DEFAULT_BANNER
                  }
                  alt="Banner"
                  className="w-full h-full object-cover rounded absolute shadow"
                />
              )}
              <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded" />

              <div
                className={`w-20 h-20 md:w-28 md:h-28 rounded-full bg-cover bg-center ${
                  isLoading ? "bg-gray-300" : ""
                } bg-no-repeat absolute bottom-0 -mb-10 ml-12 shadow flex items-center justify-center`}
              >
                {isLoading ? (
                  ""
                ) : (
                  <div>
                    <img
                      src={
                        data.photo_url
                          ? data.photo_url
                          : `https://ui-avatars.com/api/?bold=true&name=${data.name}&background=random&?size=128&length=1`
                      }
                      alt="Profil"
                      className="absolute z-0 h-full w-full object-cover rounded-full shadow top-0 left-0 bottom-0 right-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="ml-36 md:ml-44 mt-4 flex gap-2">
            <WhatsappShareButton
              url={window.location.href}
              quote={""}
              hashtag={"#seminar #kompetisi #event #mahasiswa"}
              description={"Woi coba cek nih, keren taw"}
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TelegramShareButton
              url={window.location.href}
              quote={""}
              hashtag={"#seminar #kompetisi #event #mahasiswa"}
              description={"Woi coba cek nih, keren taw"}
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <LineShareButton
              url={window.location.href}
              quote={""}
              hashtag={"#seminar #kompetisi #event #mahasiswa"}
              description={"Woi coba cek nih, keren taw"}
            >
              <LineIcon size={32} round />
            </LineShareButton>
          </div>
          <div className="mt-16 md:mx-12 w-full">
            <div className="top mx-4 grid md:grid-cols-5 grid-cols-1 gap-2">
              <div className="info md:col-span-2">
                {isLoading ? (
                  <Skeleton className="w-64 h-4 rounded-full" count="1" />
                ) : (
                  <h2 className="font-bold text-2xl">{data.name}</h2>
                )}
                <div className="mt-2">
                  {isLoading ? (
                    <Skeleton className="w-40 h-4 rounded-full" count="1" />
                  ) : (
                    <span className="font-medium text-lg">{data.address}</span>
                  )}
                </div>
                <div className={"my-1"}>
                  {isLoading ? (
                    <Skeleton className="w-32 h-4 rounded-full" count="1" />
                  ) : (
                    <span className={"font-semibold"}>{data.tagline}</span>
                  )}
                </div>
                <div className={"my-1"}>
                  {isLoading ? (
                    <Skeleton className="w-32 h-4 rounded-full" count="1" />
                  ) : (
                    <span className={"text-justify"}>{data.description}</span>
                  )}
                </div>
              </div>
              <div className="text-center my-2">
                <h2 className="font-semibold text-2xl">{data.eventCreated}</h2>
                <h2 className="font-light text-2xl">Event Terbuat</h2>
              </div>
              <div className="text-center my-2">
                <h2 className="font-semibold text-2xl">{data.countSales}</h2>
                <h2 className="font-light text-2xl">Tiket Terjual</h2>
              </div>
              <div className="text-center my-2">
                <h2 className="font-semibold text-2xl">{data.eventOngoing}</h2>
                <h2 className="font-light text-2xl">Event Berlangsung</h2>
              </div>
            </div>
            <div className="bottom">
              <div className="mt-12 mx-2">
                <h2 className="font-bold text-2xl">Events</h2>
                <div className="grid md:grid-cols-5 grid-cols-1 gap-2 my-2">
                  {event.length === 0
                    ? "Belum Ada Event Ditemukan"
                    : event.map((item, i) => (
                        <MainTicketBar
                          key={i}
                          data={item}
                          loading={isEventLoading}
                        />
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default PublicProfileView;

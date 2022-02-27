import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import apiClient from "../../services/apiClient";
import MainButton from "../../MainButton";
import { Link } from "react-router-dom";
import MainTicketBar from "./components/MainTicketBar";
import Skeleton from "../../Skeleton";
import isUser from "../../services/isUser";
import useQuery from "../../useQuery";
import handleSwal from "../../handleSwal";
import InfoModal from "../../modals/InfoModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [RecLoading, setRecLoading] = useState(false);
  const [recom, setRec] = useState([]);
  const query = useQuery();
  useEffect(() => {
    const getRec = async () => {
      await apiClient
        .get("api/v1/user/rekomendasi/event?limit=true")
        .then((response) => {
          setRec(response.data.data);
          setRecLoading(false);
        });
    };


    if(query.get("result") === "success") {
      handleSwal("Berhasil memverifikasi email");
      window.history.replaceState({}, document.title, "/");
    }

    isUser()
    setLoading(true);
    setRecLoading(true);
    getRec();
    setLoading(false);
  }, [setRec]);


  return (
    <MainLayout top={true} footer={true} menu={true}>
      <InfoModal
        showModal={showModal}
        title="Kamu bukan organizer lo..."
        handleClose={() => {
          setShowModal(false);
        }}
      >
        Hehe kalo mau buat event, login sebagai organisasi dulu yuk
      </InfoModal>
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <>
              <Skeleton className="w-full rounded-full h-4" count="1" />
              <Skeleton className="w-4/6 mx-auto rounded-full h-4" count="1" />
            </>
          ) : (
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white md:text-3xl">
              Mo buat event ato nyari event? <br />
            </h1>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {/* <div className="mx-auto"> */}
            {loading ? (
              <Skeleton className="ml-auto w-4/6 h-12 rounded" count={1} />
            ) : (
              <MainButton
                className="mt-8 mx-1 rounded-lg w-4/6 ml-auto"
                type="button"
                onClick={() => {
                  setShowModal(true);
                }}
                label="Buat event"
              />
            )}
            {loading ? (
              <Skeleton className="w-4/6 h-12 rounded" count={1} />
            ) : (
              <Link
                className="mt-8 mx-1 rounded-lg w-4/6 font-semibold px-4 py-2 tracking-wide border border-black text-black transition-colors duration-200 transform bg-yellow-400 hover:bg-yellow-300 focus:outline-none"
                to="/explore/event"
              >
                Cari event
              </Link>
            )}
            {/* </div> */}
          </div>
        </div>
        <div className="mt-20">
          <h2 className="font-bold text-2xl mb-4">Kenapa harus exotix?</h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <div className="md:w-4/6 w-4/6 mx-auto md:ml-auto">
              <img src={process.env.PUBLIC_URL + "/surprise.svg"} alt="Icon" />
            </div>
            <div className="py-12">
              <h2 className="text-justify font-small text-xl mb-4">
                Exotix adalah platform trading, asekk. <br />
                <b>Trading tiket</b> atau jual beli tiket, disini kamu bisa
                menjual tiket misal organisasi kampus kamu mau jual tiket bisa
                disini aja. Dan yang pasti <b>paperless, mudah, dan cepat</b>{" "}
                <br /> <br />
                Gak cuma itu karena kamu disini bisa beli tiket dan dapet{" "}
                <b>promo2</b> juga, apalagi gen-z sekarang pemburu promo kan,
                ewh -_-
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-20">
          {RecLoading ? (
            <Skeleton
              className="w-1/3 mx-auto rounded-full h-6 mb-4"
              count="1"
            />
          ) : (
            <h2 className="font-bold text-2xl mb-4">
              Rekomendasi event buat kamu
            </h2>
          )}
          {RecLoading ? (
            <Skeleton className="w-28 ml-auto rounded-full h-4" count="1" />
          ) : (
            <p className="text-right font-semibold text-blue-500 hover:text-blue-700 duration-500">
              <Link to="/explore/event">Lihat Semua</Link>
            </p>
          )}
          <div className="overflow-x-auto overscroll-contain mt-4">
            <div className="md:grid md:grid-cols-4 webkit-inline-box flex grid-cols-2 gap-2">
              {RecLoading ? (
                <>
                  <MainTicketBar loading={RecLoading} />
                  <MainTicketBar loading={RecLoading} />
                  <MainTicketBar loading={RecLoading} />
                  <MainTicketBar loading={RecLoading} />
                </>
              ) : (
                recom.map((item, i) => (
                  <MainTicketBar data={item} key={i} loading={loading} />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="mt-20">
          {loading ? (
            <div>
              <Skeleton className="w-1/4 h-4 mx-auto rounded-full" count="1" />
              <Skeleton className="w-1/3 h-4 mx-auto rounded-full" count="1" />
            </div>
          ) : (
            <h2 className="font-medium text-2xl mb-4">
              “Sudahi sedihmu kawand, <br /> mari tuangkan anggur dan terbang
              bersamaku”
            </h2>
          )}
        </div>
        <div className="mt-20">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {loading ? (
              <Skeleton className="w-48 h-64 ml-auto rounded-lg" count="1" />
            ) : (
              <img
                className="w-4/6 md:ml-auto mx-auto"
                src={process.env.PUBLIC_URL + "/drunk.svg"}
                alt="Icon"
              />
            )}
            <div>
              {loading ? (
                <div className="mt-8">
                  <Skeleton className="w-1/2 h-4 rounded-full" count="1" />
                  <Skeleton className="w-1/4 h-4 rounded-full" count="1" />
                </div>
              ) : (
                <h2 className="font-bold text-4xl mb-4 md:text-left text-center mt-8">
                  Kamu masih bingung <br /> sama Exotix?
                </h2>
              )}
              <div className="grid md:grid-cols-4 grid-cols-1 gap-2 mt-12">
                {loading ? (
                  <Skeleton className="w-full h-12 rounded" count="1" />
                ) : (
                  <MainButton
                    onClick={() => {
                      window.location.href = "/d/about";
                    }}
                    label="Tentang Kami"
                    type="button"
                  />
                )}
                {loading ? (
                  <Skeleton className="w-full h-12 rounded" count="1" />
                ) : (
                  <MainButton
                    onClick={() => {
                      window.location.href = "/d/how-it-works";
                    }}
                    label="Cara Kerja"
                    type="button"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

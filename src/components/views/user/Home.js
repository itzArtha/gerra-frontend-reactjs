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
import InstallPWA from "./components/InstallPWA";

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

    if (query.get("result") === "success") {
      handleSwal("Berhasil memverifikasi email");
      window.history.replaceState({}, document.title, "/");
    }

    isUser();
    setLoading(true);
    setRecLoading(true);
    getRec();
    setLoading(false);
  }, [setRec]);

  return (
    <MainLayout top={true} footer={true} menu={true}>
      {/* <InstallPWA /> */}
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
              Mau buat event / nyari event? <br />
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
          <h2 className="font-bold text-2xl mb-4">Kenapa harus tokoevent?</h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <div className="md:w-4/6 w-4/6 mx-auto md:ml-auto">
              <img src={process.env.PUBLIC_URL + "/surprise.svg"} alt="Icon" />
            </div>
            <div className="py-12">
              <h2 className="text-justify font-small text-xl mb-4">
                Tokoevent adalah platform jual beli tiket event kampus, event
                umum, event mahasiswa dan disini kamu bisa jual tiket. Misal
                organisasi kampus kamu mau ngadain event & jual tiket bisa
                disini aja, dan yang pasti{" "}
                <b>paperless, mudah, aman, dan cepat</b> <br /> <br />
                Gak cuma itu karena kamu disini bisa beli tiket dan dapet{" "}
                <b>promo2</b> juga, apalagi gen-z sekarang pemburu promo kan{" "}
                <br />
                <br />
                <b>#DariMahasiswaUntukBangsa #TokoeventTanpaSpasi</b>
              </h2>
              <div className={"text-left"}>
                <MainButton
                  onClick={() => {
                    window.open("https://wa.me/6281238169667", "_blank");
                  }}
                  label="Hubungi Kami"
                  type="button"
                />
              </div>
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
        <div className={"mt-24"}>
          <h2 className="font-bold text-4xl mb-4 text-center mt-8">
            Partners & Supports
          </h2>
          <div className={"mt-12"}>
            <div
              className={
                "md:flex md:justify-center md:gap-8 grid grid-cols-2 gap-4"
              }
            >
              <div className={"my-auto"}>
                <img
                  className={"w-48 mt-7"}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_Gerakan_Nasional_1000_Startup_Digital.png/800px-Logo_Gerakan_Nasional_1000_Startup_Digital.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48"}
                  src="https://pk2umk.kemenkopukm.go.id/img/logo.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/ARKAYA.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://www.ibt.stikom-bali.ac.id/inbis/img/works/full/Logo%20Inkubator%20Bisnis%20STIKOM%20Bali.jpg"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/DIESTERIA.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/MAKSIS+UNUD.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/KRAMAT.png"
                  alt="Logo"
                />
              </div>{" "}
            </div>
            <div
              className={
                "md:flex md:justify-center md:gap-8 grid grid-cols-2 gap-4"
              }
            >
              <div className={"my-auto"}>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/PNB+FAIR.png"
                  alt="Logo"
                />
              </div>
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/HANAMI.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/GREATFEST.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/DELUSI.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/ARTSPIRASI.png"
                  alt="Logo"
                />
              </div>{" "}
              <div>
                <img
                  className={"w-48 mt-7"}
                  src="https://assets-gerra.s3.ap-southeast-1.amazonaws.com/AMK+FEST.png"
                  alt="Logo"
                />
              </div>{" "}
              <div className={"my-auto"}>
                <img
                  className={"w-48 mt-7"}
                  src="https://yt3.ggpht.com/CBOVsvx28XnvYNCcmkmWGkz2xWv1hK5lBkj8VY4Cp1k951kGgmE300s8JQywb3uN8BIFjmVA=s900-c-k-c0x00ffffff-no-rj"
                  alt="Logo"
                />
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="mt-48">
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
                  Kamu masih bingung <br /> sama tokoevent?
                </h2>
              )}
              <div className="grid md:grid-cols-4 grid-cols-1 gap-2 mt-12">
                {/*                {loading ? (
                  <Skeleton className="w-full h-12 rounded" count="1" />
                ) : (
                  <MainButton
                    onClick={() => {
                      window.location.href = "/d/about";
                    }}
                    label="Tentang Kami"
                    type="button"
                  />
                )}*/}
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

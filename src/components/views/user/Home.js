import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MainModal from "../../modals/MainModal";
import apiClient from "../../services/apiClient";
import MainButton from "../../MainButton";
import SecondTicketBar from "./components/SecondTicketBar";
import OrganizationBar from "./components/OrganizationBar";
import { Link } from "react-router-dom";
import MainTicketBar from "./components/MainTicketBar";
import Skeleton from "../../Skeleton";
import Logout from "../../auth/Logout";
import isUser from "../../services/isUser";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OrgLoading, setOrgLoading] = useState(false);
  const [TrendLoading, setTrendLoading] = useState(false);
  const [RecLoading, setRecLoading] = useState(false);
  const [TopOrg, setTopOrg] = useState(Array);
  const [trend, setTrend] = useState(Array);
  const [recom, setRec] = useState(Array);
  useEffect(() => {
    const getTopOrg = async () => {
      await apiClient
        .get("api/v1/organization/top?limit=true")
        .then((response) => {
          setTopOrg(response.data.data);
          setOrgLoading(false);
        });
    };
    const getTrendNow = async () => {
      await apiClient.get("api/v1/user/trend/event").then((response) => {
        setTrend(response.data.data);
        setTrendLoading(false);
      });
    };
    const getRec = async () => {
      await apiClient
        .get("api/v1/user/rekomendasi/event?limit=true")
        .then((response) => {
          setRec(response.data.data);
          setRecLoading(false);
        });
    };
    setLoading(true);
    setRecLoading(true);
    getRec();
    setTrendLoading(true);
    getTrendNow();
    setOrgLoading(true);
    getTopOrg();
    setLoading(false);
  }, [setTopOrg, setTrend, setRec]);

  return (
    <MainLayout top={true} footer={true} menu={true}>
      <MainModal
        showModal={showModal}
        title="Kamu bukan organizer lo..."
        onClick={() => {
          // Logout();
        }}
        handleClose={() => {
          setShowModal(false);
        }}
      >
        Hehe kalo mau buat event, login sebagai organisasi dulu yuk
      </MainModal>
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <>
              <Skeleton className="w-full rounded-full h-4" count="1" />
              <Skeleton className="w-4/6 mx-auto rounded-full h-4" count="1" />
            </>
          ) : (
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white md:text-3xl">
              Mo buat event ato nyari event? <br /> Gampang anj*r disini
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
          {TrendLoading ? (
            <Skeleton
              className="w-36 mx-auto rounded-full h-4 mb-4"
              count="1"
            />
          ) : (
            <h2 className="font-bold text-2xl mb-4">Trend Now</h2>
          )}
          <div className="overflow-x-auto whitespace-nowrap overscroll-contain">
            <div className="webkit-inline-box md:flex grid-cols-2 gap-2">
              {TrendLoading ? (
                <>
                  <SecondTicketBar loading={TrendLoading} />
                  <SecondTicketBar loading={TrendLoading} />
                </>
              ) : (
                trend.map((item, i) => (
                  <SecondTicketBar key={i} data={item} loading={TrendLoading} />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="mt-20">
          {OrgLoading ? (
            <Skeleton
              className="w-48 mx-auto rounded-full h-4 mb-4"
              count="1"
            />
          ) : (
            <h2 className="font-bold text-2xl mb-4">Top Organizations</h2>
          )}
          {OrgLoading ? (
            <Skeleton className="w-28 ml-auto rounded-full h-4" count="1" />
          ) : (
            <p className="text-right font-semibold text-blue-500 hover:text-blue-700 duration-500">
              <Link to="/organization/top">Lihat Semua</Link>
            </p>
          )}
          <div className="overflow-x-auto whitespace-nowrap overscroll-contain mt-4">
            <div className="webkit-inline-box md:flex items-center justify-center gap-4">
              {OrgLoading ? (
                <>
                  <OrganizationBar loading={OrgLoading} />
                  <OrganizationBar loading={OrgLoading} />
                  <OrganizationBar loading={OrgLoading} />
                </>
              ) : (
                TopOrg.map((item, i) => (
                  <OrganizationBar data={item} key={i} loading={OrgLoading} />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="mt-20">
          {RecLoading ? (
            <Skeleton
              className="w-1/3 mx-auto rounded-full h-4 mb-4"
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
              <Link to="/event/rekomendasi">Lihat Semua</Link>
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
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <Skeleton className="w-48 h-64 ml-auto rounded-lg" count="1" />
            ) : (
              <img
                className="w-4/6 ml-auto"
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
                <h2 className="font-bold text-4xl mb-4 text-left mt-8">
                  Kamu masih bingung <br /> sama Gerra?
                </h2>
              )}
              <div className="grid grid-cols-4 gap-2 mt-12">
                {loading ? (
                  <Skeleton className="w-full h-12 rounded" count="1" />
                ) : (
                  <MainButton label="Tentang Kami" type="button" />
                )}
                {loading ? (
                  <Skeleton className="w-full h-12 rounded" count="1" />
                ) : (
                  <MainButton label="Cara Kerja" type="button" />
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

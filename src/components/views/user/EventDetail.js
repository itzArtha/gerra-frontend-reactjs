import { useParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import MainButton from "../../MainButton";
import IconWithTitle from "../IconWithTitle";
import RoundedButton from "../../RoundedButton";
import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import apiClient from "../../services/apiClient";
import Checkbox from "../../Checkbox";
import MainInput from "../../MainInput";
import ErrorLabel from "../../ErrorLabel";
import Label from "../../Label";
import CurrencyFormat from "react-currency-format";
import MainModal from "../../modals/MainModal";

const EventDetail = () => {
  const { slug } = useParams();
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState(0);
  const [mode, setMode] = useState(0);
  const [calculate, setCalculate] = useState({
    subtotal: 0,
    fee: 0,
    discount: 0,
    total: 0,
  });
  const [data, setData] = useState();
  const [ticket, setTicket] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    isNameError: false,
    nameErrorLabel: "Nama lengkap ga boleh kosong",
    email: "",
    isEmailError: false,
    emailErrorLabel: "Email ga boleh kosong",
    hp: "",
    isHpError: false,
    hpErrorLabel: "No. Telepon ga boleh kosong",
    customField: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/organization/event/" + slug)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          //
        });
    };
    fetchData();
  }, [setData]);

  const handleSelectTicket = (e) => {
    const id = e.target.value;
    const price = data.ticket.filter((i) => i.id === parseInt(id))[0];
    let newArray = [...ticket, { id, price }];
    if (ticket.filter((i) => i.id === id).length > 0) {
      newArray = newArray.filter((i) => i.id !== id);
    }
    setTicket(newArray);
    // Logic
    let subtotal = 0,
      fee = 0,
      total = 0,
      discount = 0;
    newArray.map((item, i) => (subtotal += parseInt(item.price.price)));
    fee = subtotal * 0.05;
    discount = subtotal > 1000 ? -1000 : 0;
    total = subtotal + fee + discount;
    setCalculate({
      subtotal: subtotal,
      fee: fee,
      discount: discount,
      total: total,
    });
  };

  return (
    <MainLayout top={true} footer={true}>
      <div className="mt-12 mx-4 md:mx-12">
        <div className="text-right">
          {loading ? (
            <Skeleton className="ml-auto w-20 h-12 rounded" count={1} />
          ) : (
            <MainButton
              type="button"
              label={mode === 0 ? "Beli" : "Detail Event"}
              onClick={() => {
                setMode(mode ? 0 : 1);
              }}
            />
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            {loading ? (
              <Skeleton className="w-full h-64 rounded-lg" count="1" />
            ) : (
              <img
                className="w-full md:h-80 h-64 object-cover"
                src={data.banner_url}
                alt="Icon"
              />
            )}
          </div>
          <div className="md:col-span-3">
            {loading ? (
              <Skeleton className="w-1/2 h-4 rounded-full" count="1" />
            ) : (
              <h2 className="text-3xl font-semibold">Webinar Nasional</h2>
            )}
            <div className="mt-4">
              <Link to={`/organization/${loading ? `` : data.owner_username}`}>
                <IconWithTitle
                  title={loading ? "" : data.owner}
                  loading={loading}
                  icon={
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={loading ? "" : data.photo_url}
                      alt="Icon"
                    />
                  }
                />
              </Link>
              <IconWithTitle
                loading={loading}
                className="mt-2"
                title={
                  <CurrencyFormat
                    value={loading ? 0 : data.ticket[0].price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                }
                icon={
                  <RoundedButton type="button" className="w-8 h-8">
                    <img
                      className="w-4 h-4"
                      src={process.env.PUBLIC_URL + "/coin-stack.svg"}
                      alt="Icon"
                    />
                  </RoundedButton>
                }
              />
              <IconWithTitle
                title={loading ? "" : data.start_at + " - " + data.end_at}
                className="mt-2"
                loading={loading}
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
              <IconWithTitle
                title={loading ? "" : data.location}
                className="mt-2"
                loading={loading}
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
        </div>
        {mode === 0 ? (
          <>
            <div className="mt-24 flex justify-center gap-2">
              <MainButton
                type="button"
                onClick={() => {
                  setChoice(0);
                }}
                label="Deskripsi Event"
              />
              <MainButton
                type="button"
                onClick={() => {
                  setChoice(1);
                }}
                label="Syarat & Ketentuan"
              />
            </div>
            <div className="md:mx-24">
              {loading ? (
                <Skeleton
                  className="w-1/5 h-4 my-4 mx-auto rounded-full"
                  count="1"
                />
              ) : (
                <h2 className="text-2xl text-center font-bold mt-12">
                  {choice === 0
                    ? "Deskripsi Event"
                    : "Syarat & Ketentuan Event"}
                </h2>
              )}
              {loading ? (
                <Skeleton className="w-full h-4 rounded-full" count="5" />
              ) : choice === 0 ? (
                <p className="mt-4">{data.description}</p>
              ) : (
                <p className="mt-4">{data.terms}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mt-24 md:mx-24">
              <h2 className="text-2xl text-center font-bold mt-12">
                Daftar Tiket
              </h2>
              <div className="overflow-x-auto whitespace-nowrap overscroll-contain mt-4">
                <div className="md:grid md:grid-cols-3 webkit-inline-box flex grid-cols-2 gap-4">
                  {data.ticket.map((item, i) => (
                    <label
                      htmlFor={`checkbox${i}`}
                      key={i}
                      className={`w-full h-32 border p-2 ${
                        ticket.filter((c) => c.id !== item.id).length > 0
                          ? "border-yellow-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <Checkbox
                            value={item.id}
                            id={`checkbox${i}`}
                            onChange={handleSelectTicket}
                          />
                        </div>
                        <div>
                          <h2 className="text-right font-semibold text-lg">
                            {item.title}
                          </h2>
                        </div>
                      </div>

                      <h2 className="text-right font-semibold text-lg mt-10">
                        <CurrencyFormat
                          value={loading ? 0 : data.ticket[0].price}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"Rp"}
                        />
                        /
                        <span className="text-sm">
                          {item.type === 0 ? "Person" : "Tim"}
                        </span>
                      </h2>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:flex md:justify-between mt-4">
                <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold">
                    Informasi{" "}
                    {ticket.filter((i) => i.price.type === 1).length > 0
                      ? "Ketua Tim"
                      : "Personal"}
                  </h2>
                  <div className="mt-4">
                    <div className="pb-4">
                      <Label label="Nama Lengkap" />
                      <MainInput
                        value={formData.name}
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            isNameError: false,
                          });
                        }}
                      />
                      {formData.isNameError ? (
                        <ErrorLabel label={formData.nameErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="pb-4">
                      <Label label="Email" />
                      <MainInput
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            email: e.target.value,
                            isEmailError: false,
                          });
                        }}
                        type="email"
                      />
                      {formData.isEmailError ? (
                        <ErrorLabel label={formData.emailErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="pb-4">
                      <Label label="No. telepon" />
                      <MainInput
                        value={formData.hp}
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            hp: e.target.value,
                            isHpError: false,
                          });
                        }}
                      />
                      {formData.isHpError ? (
                        <ErrorLabel label={formData.hpErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="pb-4">
                      <Label label="Custom Field" />
                      <MainInput
                        value={formData.hp}
                        type="text"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            hp: e.target.value,
                            isHpError: false,
                          });
                        }}
                      />
                      {formData.isHpError ? (
                        <ErrorLabel label={formData.hpErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {ticket.filter((i) => i.price.type === 1).length > 0 ? (
                    <div className="w-full">
                      <h2 className="text-2xl font-bold">Informasi Tim</h2>
                      <div className="my-4">
                        <IconWithTitle
                          title={"Exova Indonesia"}
                          loading={loading}
                          className="my-8"
                          icon={
                            <img
                              className="w-10 h-10 rounded-full object-cover"
                              src={loading ? "" : data.photo_url}
                              alt="Icon"
                            />
                          }
                        />
                      </div>
                      <div>
                        <MainButton
                          type="button"
                          className="w-full mt-4"
                          label="Tambah Anggota Tim"
                          onClick={() => {
                            setShowAddTeam(true);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold">Informasi Pembelian</h2>
                  <div className="mt-4">
                    <MainButton
                      type="button"
                      label="Apakah kamu punya kupon?"
                      onClick={() => {
                        setShowCoupon(true);
                      }}
                    />
                    <div className="mt-2">
                      <div className="flex justify-between my-1">
                        <div>
                          <span className="text-xl">
                            Tiket Pendaftaran ({ticket.length})
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-xl">
                            <CurrencyFormat
                              value={calculate.subtotal}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"Rp"}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between my-1">
                        <div>
                          <span className="text-xl">Biaya Admin</span>
                        </div>
                        <div>
                          <span className="font-semibold text-xl">
                            <CurrencyFormat
                              value={calculate.fee}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"Rp"}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between my-1">
                        <div>
                          <span className="text-xl">Discount</span>
                        </div>
                        <div>
                          <span className="font-semibold text-xl">
                            {" "}
                            <CurrencyFormat
                              value={calculate.discount}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"Rp"}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="mt-36">
                        <h2 className="text-xl font-bold text-right">
                          Subtotal
                        </h2>
                        <h2 className="text-4xl font-bold text-right">
                          <CurrencyFormat
                            value={calculate.total}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"Rp"}
                          />
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <MainButton type="button" label="Checkout" onClick={() => {}} />
              </div>
            </div>
            <MainModal
              showModal={showAddTeam || showCoupon}
              handleClose={() => {
                showAddTeam ? setShowAddTeam(false) : setShowCoupon(false);
              }}
              buttonLabel={showAddTeam ? "Tambah Anggota" : "Simpan"}
              title={showAddTeam ? "Tambah Anggota" : "Tambahkan Kupon Diskon"}
              button={true}
            >
              {showAddTeam ? (
                <div>
                  <div className="pb-4">
                    <Label label="Cari Anggota" />
                    <MainInput
                      value={formData.name}
                      type="text"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          isNameError: false,
                        });
                      }}
                    />
                    {formData.isNameError ? (
                      <ErrorLabel label={formData.nameErrorLabel} />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pb-4">
                    <Label label="Cek Kupon" />
                    <MainInput
                      value={formData.name}
                      type="text"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          isNameError: false,
                        });
                      }}
                    />
                    {formData.isNameError ? (
                      <ErrorLabel label={formData.nameErrorLabel} />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </MainModal>
          </>
        )}
      </div>
    </MainLayout>
  );
};
export default EventDetail;

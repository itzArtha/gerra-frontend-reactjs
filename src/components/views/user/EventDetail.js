import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import MainButton from "../../MainButton";
import IconWithTitle from "../IconWithTitle";
import RoundedButton from "../../RoundedButton";
import { useEffect, useRef, useState } from "react";
import Skeleton from "../../Skeleton";
import apiClient from "../../services/apiClient";
import Checkbox from "../../Checkbox";
import MainInput from "../../MainInput";
import ErrorLabel from "../../ErrorLabel";
import Label from "../../Label";
import CurrencyFormat from "react-currency-format";
import MainModal from "../../modals/MainModal";
import moment from "moment";
import Radio from "../../Radio";
import {
  WhatsappIcon,
  WhatsappShareButton,
  LineShareButton,
  LineIcon,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";
import handleSwal from "../../handleSwal";

const EventDetail = () => {
  const { slug } = useParams();
  const history = useHistory();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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
  const [allUsers, setAllUsers] = useState([]);
  const [authUser, setAuthUser] = useState();
  // const [field, setField] = useState([]);
  const [choosePart, setChoosePart] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    roles: 0,
    name: "",
    isNameError: false,
    nameErrorLabel: "Nama lengkap ga boleh kosong",
    email: "",
    isEmailError: false,
    emailErrorLabel: "Email ga boleh kosong",
    hp: "",
    isHpError: false,
    hpErrorLabel: "No. Telepon ga boleh kosong",
    sex: "",
    isSexError: false,
    sexErrorLabel: "Jenis kelamin ga boleh kosong",
    ktp: "",
    isKtpError: false,
    ktpErrorLabel: "KTP ga boleh kosong",
    birthday: "",
    isBirthdayError: false,
    birthdayErrorLabel: "KTP ga boleh kosong",
    instansi: "",
    isInstansiError: false,
    instansiErrorLabel: "KTP ga boleh kosong",
    searchPart: "",
    coupon: "",
    isCouponError: false,
    couponErrorLabel: "Coupon ga boleh kosong",
    discountCode: "",
  });

  const handleClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/organization/event/" + slug)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          apiClient.post("api/v1/view/event", {
            event_id: response.data.data.id,
          });
        })
        .catch((error) => {
          handleSwal(error.response.data.message, "error");
          if(error.response.status === 401) {
            window.location.href = "/login";
          }
        });
    };

    const fetchAuthUser = async () => {
      await apiClient.get("/api/v1/user").then((response) => {
        setAuthUser(response.data.data);
        setFormData({
          ...formData,
          name: response.data.data.name,
          hp: response.data.data.hp,
          email: response.data.data.email,
          sex: response.data.data.sex,
          id: response.data.data.id,
          roles: parseInt(response.data.data.roles),
        });
      });
    };

    fetchAuthUser();
    fetchData();
  }, [setData]);

  const handleModal = () => {
    showAddTeam ? setShowAddTeam(false) : handleCoupon();
  };

  const handleCloseModal = () => {
    if (showAddTeam) {
      setShowAddTeam(false);
      setChoosePart([]);
    } else {
      setShowCoupon(false);
    }
  };

  const handleCoupon = async () => {
    await apiClient
      .get("/api/v1/user/voucher/" + formData.coupon)
      .then((response) => {
        setCalculate({
          ...calculate,
          discount: response.data.amount,
        });
        setFormData({ ...formData, discountCode: formData.coupon });
        handleLogic(ticket, response.data.amount);
        setShowCoupon(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setFormData({
            ...formData,
            isCouponError: true,
            couponErrorLabel: error.response.data,
          });
        }
      });
  };

  const handleOpenAddModal = () => {
    const fetchPartSearch = async () => {
      await apiClient
        .get("/api/v1/user/search")
        .then((response) => {
          setAllUsers(response.data.data);
        })
        .catch((error) => {
          //
        });
    };
    fetchPartSearch();
    setShowAddTeam(true);
  };

  const filteredPersons = allUsers.filter((person) => {
    return person.name
      .toLowerCase()
      .includes(formData.searchPart.toLowerCase());
  });

  const handleSearchPart = (e) => {
    setFormData({ ...formData, searchPart: e.target.value });
  };

  const handleDeleteChoosenPart = (id) => {
    const newArray = choosePart.filter((i) => i.id !== id);
    setChoosePart(newArray);
  };

  const handleSelectPart = (e) => {
    const id = e.target.value;
    const res = allUsers.filter((i) => i.id === parseInt(id))[0];
    let newArray = [...choosePart, { id, res }];
    if (choosePart.filter((i) => i.id === id).length > 0) {
      newArray = newArray.filter((i) => i.id !== id);
    }
    setChoosePart(newArray);
    // console.log(newArray);
  };

  const handleSelectTicket = (e) => {
    setFormData({ ...formData, discountCode: "" });
    const id = e.target.value;
    const price = data.ticket.filter((i) => i.id === parseInt(id))[0];
    let newArray = [...ticket, { id, price }];
    if (ticket.filter((i) => i.id === id).length > 0) {
      newArray = newArray.filter((i) => i.id !== id);
    }
    setTicket(newArray);
    // Logic
    handleLogic(newArray, calculate.discount);
  };

  const handleLogic = (newArray, discount) => {
    let subtotal = 0,
      fee = 0,
      total = 0;
    newArray.map((item, i) => (subtotal += parseInt(item.price.price)));
    fee = subtotal * 0.05;
    discount = subtotal * discount;
    total = subtotal + fee - discount;
    setCalculate({
      subtotal: subtotal,
      fee: fee,
      discount: discount,
      total: total,
    });
  };

  const handleValidate = () => {
    if (formData.name && formData.email && formData.hp && ticket.length > 0) {
      handleCheckout();
    } else if (ticket.length <= 0) {
      handleSwal("Kamu harus memilih tiket", "warning");
    } else if (!formData.name) {
      setFormData({ ...formData, isNameError: true });
    } else if (!formData.email) {
      setFormData({ ...formData, isEmailError: true });
    } else if (!formData.hp) {
      setFormData({ ...formData, isHpError: true });
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    await apiClient
      .post("/api/v1/user/checkout", {
        user_id: formData.id,
        event_id: data.id,
        ticket: ticket,
        discount_id: formData.discountCode,
        data: {
          name: formData.name,
          email: formData.email,
          hp: formData.hp,
          sex: formData.sex,
          ktp: formData.ktp,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          history.push("/payment");
          setCheckoutLoading(false);
        } else if (response.status === 201) {
          window.location = "/tickets/all-tickets";
        }
      })
      .catch((error) => {
        setCheckoutLoading(false);
        handleSwal(error.response.data.message, "error");
      });
  };

  return (
    <MainLayout top={true} footer={true}>
      <div className="mt-12 mx-4 md:mx-12">
        <div className="text-right">
          {loading ? (
            <Skeleton className="ml-auto w-20 h-12 rounded" count={1} />
          ) : data.is_mine ? (
            <MainButton
              type="button"
              label="Edit"
              onClick={() => {
                history.push("/manage/event/" + slug);
              }}
            />
          ) : data.status === 1 && formData.roles === 1 ? (
            <MainButton
              type="button"
              label={mode === 0 ? "Beli" : "Detail Event"}
              onClick={() => {
                setMode(mode ? 0 : 1);
                handleClick();
              }}
            />
          ) : (
            ""
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
              <div className="flex gap-3">
                <div>
                  <h2 className="text-3xl font-semibold">{data.title}</h2>
                </div>
                <div className="flex gap-2">
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
              </div>
            )}

            {loading ? (
              <Skeleton className="w-36 h-4 rounded-full" count="1" />
            ) : (
              <div className="my-2 flex gap-2">
                <div>
                  <h2 className="text-md font-semibold text-blue-500">
                    {data.format} | {data.category}
                  </h2>
                </div>
                <div>
                  {data.status === 2 ? (
                    <span className="px-4 py-1 rounded-full text-sm bg-red-100 text-red-600">
                      {"Event Berakhir"}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
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
              {/* <IconWithTitle
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
              /> */}
              <IconWithTitle
                title={loading ? "" : moment(data.start_at).format("llll")}
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
                title={
                  loading
                    ? ""
                    : data.location + " " + (data.is_online ? "Online" : "")
                }
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
              <IconWithTitle
                title={`${loading ? "" : data.viewers} kali dilihat`}
                className="mt-2"
                loading={loading}
                icon={
                  <RoundedButton type="button" className="w-8 h-8">
                    <img
                      className="w-4 h-4"
                      src={process.env.PUBLIC_URL + "/eye.svg"}
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
            <div className="mt-24 flex justify-center gap-2" ref={scrollRef}>
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
            <div className="mt-24 md:mx-24" ref={scrollRef}>
              <h2 className="text-2xl text-center font-bold mt-12">
                Daftar Tiket
              </h2>
              <div className="mt-4">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  {data.ticket.map((item, i) => (
                    <label
                      htmlFor={`checkbox${i}`}
                      key={i}
                      className={`w-full h-32 border p-2 ${
                        ticket.filter(
                          (c) => parseInt(c.id) === parseInt(item.id)
                        ).length > 0
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
                            checked={
                              ticket.filter(
                                (c) => parseInt(c.id) === parseInt(item.id)
                              ).length > 0
                                ? true
                                : false
                            }
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
                          value={loading ? 0 : item.price}
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
              <div className="md:flex md:justify-between mt-8">
                <div className="md:w-1/3">
                  <h2 className="text-2xl font-bold">
                    Informasi{" "}
                    {ticket.filter((i) => i.price.type === 1).length > 0
                      ? "Ketua Tim"
                      : "Personal"}
                  </h2>
                  <div className="mt-4">
                    <div className="pb-4">
                      <Label label={"Nama Lengkap"} />
                      <MainInput
                        value={formData.name}
                        type={"text"}
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
                      <Label label={"Email"} />
                      <MainInput
                        value={formData.email}
                        type={"text"}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            email: e.target.value,
                            isEmailError: false,
                          });
                        }}
                      />
                      {formData.isEmailError ? (
                        <ErrorLabel label={formData.emailErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="pb-4">
                      <Label label={"No. Telepon"} />
                      <MainInput
                        value={formData.hp}
                        type={"text"}
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
                    {data.APInformation.sex ? (
                      <div className="pb-4">
                        <Label label={"Jenis Kelamin"} />
                        <div className="flex gap-4">
                          <Radio
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                sex: e.target.value,
                              });
                            }}
                            name="SexType"
                            label={"Perempuan"}
                            value="0"
                            checked={
                              parseInt(formData.sex) === 0 ? true : false
                            }
                          />
                          <Radio
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                sex: e.target.value,
                              });
                            }}
                            name="SexType"
                            label={"Laki - Laki"}
                            value="1"
                            checked={
                              parseInt(formData.sex) === 1 ? true : false
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {data.APInformation.instansi ? (
                      <div className="pb-4">
                        <Label label={"Instansi"} />
                        <MainInput
                          value={formData.instansi}
                          type={"text"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              instansi: e.target.value,
                            });
                          }}
                        />
                        {formData.isInstansiError ? (
                          <ErrorLabel label={formData.instansiErrorLabel} />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {data.APInformation.birthday ? (
                      <div className="pb-4">
                        <Label label={"Tanggal Lahir"} />
                        <MainInput
                          value={formData.birthday}
                          type={"date"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              birthday: e.target.value,
                            });
                          }}
                        />
                        {formData.isBirthdayError ? (
                          <ErrorLabel label={formData.birthdayErrorLabel} />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {data.APInformation.ktp ? (
                      <div className="pb-4">
                        <Label label={"KTP"} />
                        <MainInput
                          value={formData.ktp}
                          type={"text"}
                          onChange={(e) => {
                            setFormData({ ...formData, ktp: e.target.value });
                          }}
                        />
                        {formData.isKtpError ? (
                          <ErrorLabel label={formData.ktpErrorLabel} />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {ticket.filter((i) => i.price.type === 1).length > 0 ? (
                    <div className="w-full">
                      <h2 className="text-2xl font-bold">Informasi Tim</h2>
                      {choosePart.map((item, i) => (
                        <div className="my-4 flex justify-between" key={i}>
                          <IconWithTitle
                            title={item.res.name}
                            loading={loading}
                            className="m-4"
                            icon={
                              <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={
                                  loading
                                    ? ""
                                    : item.res.photo_url
                                    ? item.res.photo_url
                                    : `https://ui-avatars.com/api/?bold=true&name=${item.res.name}&background=random&?size=128&length=1`
                                }
                                alt="Icon"
                              />
                            }
                          />
                          <RoundedButton
                            onClick={() => {
                              handleDeleteChoosenPart(item.id);
                            }}
                            className="w-8 h-8 my-4"
                          >
                            <img
                              className="h-8 w-8 pr-2"
                              src={process.env.PUBLIC_URL + "/trash.svg"}
                              alt="Icon"
                            />
                          </RoundedButton>
                        </div>
                      ))}
                      <div>
                        <MainButton
                          type="button"
                          className="w-full mt-4"
                          label="Tambah Anggota Tim"
                          onClick={handleOpenAddModal}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="md:w-1/3 mt-8">
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
                      <div
                        className={`flex justify-between my-1 ${
                          calculate.discount > 0 ? "animate-pulse" : ""
                        }`}
                      >
                        <div>
                          <span className="text-xl">
                            Discount{" "}
                            {formData.discountCode
                              ? `(${formData.discountCode})`
                              : ""}{" "}
                          </span>
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
                        <h2
                          className={`text-4xl font-bold text-right ${
                            calculate.total ? "animate-pulse" : ""
                          }`}
                        >
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
              <div className="text-center mt-12">
                <MainButton
                  className="w-full md:w-36"
                  type="button"
                  label={checkoutLoading ? `Loading...` : `Checkout`}
                  onClick={() => {
                    handleValidate();
                  }}
                />
              </div>
            </div>
            <MainModal
              showModal={showAddTeam || showCoupon}
              handleClose={handleCloseModal}
              buttonLabel={showAddTeam ? "Tambah Anggota" : "Simpan"}
              title={showAddTeam ? "Tambah Anggota" : "Tambahkan Kupon Diskon"}
              button={true}
              onClick={handleModal}
            >
              {showAddTeam ? (
                <div>
                  <div className="pb-4">
                    <div className="flex justify-end">
                      <Label
                        label={`Dipilih: ${choosePart.map(
                          (item) => item.res.name
                        )}`}
                      />
                    </div>
                    <Label label="Cari Anggota" />
                    <MainInput
                      value={formData.searchPart}
                      type="text"
                      onChange={handleSearchPart}
                    />
                    {formData.isNameError ? (
                      <ErrorLabel label={formData.nameErrorLabel} />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="overflow-auto h-64">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredPersons.map((item, i) => (
                        <label
                          key={i}
                          htmlFor={`addTeamCheck${i}`}
                          className={`my-2 border ${
                            choosePart.filter(
                              (c) => parseInt(c.id) === parseInt(item.id)
                            ).length > 0
                              ? "border-yellow-400 "
                              : ""
                          }`}
                        >
                          <div className="flex justify-between">
                            <IconWithTitle
                              title={item.name}
                              loading={loading}
                              className="m-4"
                              icon={
                                <img
                                  className="w-10 h-10 rounded-full object-cover"
                                  src={
                                    loading
                                      ? ""
                                      : item.photo_url
                                      ? item.photo_url
                                      : `https://ui-avatars.com/api/?bold=true&name=${item.name}&background=random&?size=128&length=1`
                                  }
                                  alt="Icon"
                                />
                              }
                            />
                            <Checkbox
                              checked={
                                choosePart.filter(
                                  (c) => parseInt(c.id) === parseInt(item.id)
                                ).length > 0
                                  ? true
                                  : false
                              }
                              onChange={handleSelectPart}
                              value={item.id}
                              className="my-4"
                              id={`addTeamCheck${i}`}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pb-4">
                    <Label label="Cek Kupon" />
                    <MainInput
                      value={formData.coupon}
                      type="text"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          coupon: e.target.value,
                          isCouponError: false,
                        });
                      }}
                    />
                    {formData.isCouponError ? (
                      <ErrorLabel label={formData.couponErrorLabel} />
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

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
import useQuery from "../../useQuery";
import handleSwal from "../../handleSwal";
import "../../../index.css";

const EventDetail = () => {
  const { slug } = useParams();
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [auth, setAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState(0);
  const [mode, setMode] = useState(0);
  const [loadingStudio, setLoadingStudio] = useState(0);
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
  const [choosePart, setChoosePart] = useState([]);
  const [listStudio, setListStudio] = useState([]);
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
    nim: "",
    referral: "",
    searchPart: "",
    coupon: "",
    isCouponError: false,
    couponErrorLabel: "Coupon ga boleh kosong",
    discountCode: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [quantity, setQuantity] = useState(0);
  const [couponValue, setCouponValue] = useState(0);

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setFormData({ ...formData, referral: query.get("ref") });
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/organization/event/" + slug)
        .then((response) => {
          setData(response.data.data);
          console.log('aaa',response)
          setLoading(false);
          if(response.data.data.format_id == 4) getStudioData(response.data.data.id)
          apiClient.post("api/v1/view/event", {
            event_id: response.data.data.id,
          });
        })
        .catch((error) => {
          // handleSwal(error.response.data.message, "error");
          if (error.response.status === 401) {
            // setAuth(false);
            // window.location.href = "/login";
          }
        });
    };

    const fetchAuthUser = async () => {
      await apiClient
        .get("/api/v1/user")
        .then((response) => {
          setAuthUser(response.data.data);
          setFormData({
            ...formData,
            name: response.data.data.name,
            hp: response.data.data.hp,
            email: response.data.data.email,
            sex: response.data.data.sex,
            id: response.data.data.id,
            roles: parseInt(response.data.data.roles),
            referral: query.get("ref"),
          });
          setAuth(true);
        })
        .catch((error) => {
          // handleSwal(error.response.data.message, "error");
          if (error.response.status === 401) {
            setAuth(false);
            // window.location.href = "/login";
          }
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
        setCouponValue(response.data.amount);
        setFormData({ ...formData, discountCode: formData.coupon });

        handleLogic(ticket, response.data.amount, quantity);
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

  const handleIncreaseQuantity = () => {
    if (quantity >= 5) return;
    if (ticket.length === 0)
      return handleSwal("Pilih tiketmu dulu", "error");

    let qty = quantity + 1;

    setQuantity(qty);
    handleLogic(ticket, couponValue, qty);
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1 || quantity === 0) return;
    let qty = quantity - 1;

    setQuantity(qty);
    handleLogic(ticket, couponValue, qty);
  };

  const handleSelectTicket = (e) => {
    let newArray = [];
    setFormData({ ...formData, discountCode: "" });
    setCalculate({
      fee: 0,
    });

    let quantity = 1;

    const id = e.target.value;
    const price = data.ticket.filter((i) => i.id === parseInt(id))[0];
    newArray = [...newArray, { id, price }];
    if (ticket.filter((i) => i.id === id).length > 0) {
      newArray = newArray.filter((i) => i.id !== id);
    }
    setTicket(newArray);
    setQuantity(newArray.length);
    setCouponValue(0);
    // Logic
    handleLogic(newArray, 0, quantity);
  };

  const handleLogic = (newArray, discount = 0, quantity) => {
    quantity = newArray.length == 0 ? 0 : quantity;
    let subtotal = 0,
      fee = 5000 * quantity,
      total = 0;
    newArray.map(
      (item, i) => (subtotal += parseInt(item.price.price) * quantity)
    );
    discount = subtotal * discount;
    fee = subtotal == 0 ? 0 : fee;
    total = subtotal + fee + -discount;
    setCalculate({
      subtotal: subtotal,
      fee: fee,
      discount: discount,
      total: total,
    });
  };

  const handleValidate = () => {
    if (ticket.length > 0) {
      handleCheckout();
    } else {
      handleSwal("Kamu belum pilih tiket udah checkout aja", "warning");
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    await apiClient
      .post("/api/v1/user/checkout", {
        user_id: formData.id,
        event_id: data.id,
        ticket: ticket,
        quantity: quantity,
        discount_id: formData.discountCode,
        timezone: formData.timezone,
        data: {
          name: formData.name,
          email: formData.email,
          hp: formData.hp,
          sex: formData.sex,
          ktp: formData.ktp,
          nim: formData.nim,
          referral: formData.referral,
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


  const getStudioData = async(id) =>{
    setLoadingStudio(true)
    await apiClient
    .get(`api/v1/user/event/${slug}/studios`)
    .then((response) => {
      setListStudio(response.data.data)
      setLoadingStudio(false)
    })
    .catch((error) => {
      handleSwal("gagal ambil data studio", "error");
      setLoadingStudio(false)
      console.log(error);
    });
  }

  return (
    <MainLayout top={true} footer={true}>
      <div className="md:mt-12 md:mx-12">
        <div className="md:mt-4 grid grid-cols-1 md:grid-cols-5 gap-8">
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
          <div className="md:col-span-3 mx-4">
            {loading ? (
              <Skeleton className="w-1/2 h-4 rounded-full" count="1" />
            ) : (
              <div className="flex gap-3">
                <div>
                  <h2 className="text-3xl font-semibold">{data.title}</h2>
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
              <Link to={`/${loading ? `` : data.owner_username}`}>
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

        <div className={"mx-4"}>
          <div className="mt-24 flex justify-center gap-2" ref={scrollRef}>
            <MainButton
              type="button"
              onClick={() => {
                setChoice(0);
                handleScroll();
              }}
              label="Deskripsi Event"
            />
            <MainButton
              type="button"
              onClick={() => {
                setChoice(1);
                handleScroll();
              }}
              label="Beli Tiket"
            />
          </div>
          <div className="md:mx-24" ref={scrollRef}>
            {loading ? (
              <Skeleton
                className="w-1/5 h-4 my-4 mx-auto rounded-full"
                count="1"
              />
            ) : (
              <h2 className="text-2xl text-center font-bold mt-12">
                {choice === 0 ? "Deskripsi" : "Beli Tiket"}
              </h2>
            )}
            {loading ? (
              <Skeleton className="w-full h-4 rounded-full" count="5" />
            ) : choice === 0 ? (
              <>
                <p className="mt-4">{data.description}</p>
                <h2 className="text-2xl text-center font-bold mt-12">
                  {"Syarat & Ketentuan"}
                </h2>
                <p className="mt-4">{data.terms}</p>
              </>
            ) : (
              <>
                {data.format_id !== 4 ? (
                  <div className="md:mx-24" ref={scrollRef}>
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
                                {item.show_ticket ? (
                                  <Checkbox
                                    value={item.id}
                                    id={`checkbox${i}`}
                                    onChange={handleSelectTicket}
                                    checked={
                                      ticket.filter(
                                        (c) =>
                                          parseInt(c.id) === parseInt(item.id)
                                      ).length > 0
                                    }
                                  />
                                ) : (
                                  <div className={"p-2 bg-red-500 text-white"}>
                                    Closed
                                  </div>
                                )}
                              </div>
                              <div>
                                <h2 className="text-right font-semibold text-lg">
                                  {item.title}
                                </h2>
                              </div>
                            </div>

                            <div className={"flex justify-between"}>
                              {item.show_ticket ? (
                                <div className={"flex gap-2"}>
                                  <div className="custom-number-input h-10 w-32 mt-4">
                                    <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                      <MainButton
                                        onClick={() => {
                                          handleDecreaseQuantity(quantity - 1);
                                        }}
                                        label={"-"}
                                      />
                                      <input
                                        type="number"
                                        className="outline-none focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                                        name="custom-input-quantity"
                                        value={
                                          ticket.filter(
                                            (c) =>
                                              parseInt(c.id) ===
                                              parseInt(item.id)
                                          ).length > 0
                                            ? quantity
                                            : 0
                                        }
                                      />
                                      <MainButton
                                        onClick={() => {
                                          handleIncreaseQuantity(quantity + 1);
                                        }}
                                        label={"+"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div />
                              )}
                              <div>
                                <h2 className="font-semibold text-lg mt-10">
                                  <CurrencyFormat
                                    value={loading ? 0 : item.price}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"Rp"}
                                  />
                                </h2>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className={"md:flex md:justify-end"}>
                        <div className="md:w-1/3 mt-8">
                          <h2 className="text-2xl font-bold">
                            Informasi Pembelian
                          </h2>
                          <div className="mt-4">
                            <div className="mt-2">
                              <div className="flex justify-between my-1">
                                <div>
                                  <span className="text-xl">
                                    Tiket ({quantity})
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
                                  <span className="text-xl">
                                    Biaya Admin ({quantity})
                                  </span>
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
                              <div className="mt-20">
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
                    </div>
                  </div>
                ) : (
                  <div>
                    {loadingStudio ? (
                      <Skeleton className="w-36 h-4 rounded-full" count="1" />
                    ) : (
                      <ul className="mt-2 w-full sm:w-10/12 m-auto">
                        {listStudio.map((item, index) => (
                          <li key={item.name} className="border-b-2">
                            <div className="px-4 py-5 sm:px-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                              </div>
                              <div className="mt-4 items-center">
                                <div className="mt-3 flex flex-wrap">
                                  {item.available_hours.map((h, i) => (
                                    <MainButton
                                      label={h}
                                      key={i}
                                      onClick={() =>
                                        history.push(
                                          `/explore/event/${slug}/${item.id}`
                                        )
                                      }
                                      className="mr-2 mb-2"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className={"px-4 fixed w-full z-10 bottom-4 flex justify-center"}>
        {loading ? null : data.is_mine ? (
          <MainButton
            className={"w-full md:w-48"}
            type="button"
            label="Edit"
            onClick={() => {
              history.push("/manage/event/" + slug);
            }}
          />
        ) : parseInt(data.status) === 1 &&
          choice === 1 &&
          data.format_id !== 4 ? (
          <MainButton
            className="w-full md:w-36"
            type="button"
            label={checkoutLoading ? `Loading...` : `Checkout`}
            onClick={() => {
              handleValidate();
            }}
          />
        ) : (
          ""
        )}
      </div>
    </MainLayout>
  );
};
export default EventDetail;

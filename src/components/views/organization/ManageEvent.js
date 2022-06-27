import { useHistory, useParams } from "react-router-dom";
import MainInput from "../../MainInput";
import SelectInput from "../../SelectInput";
import Label from "../../Label";
import MainButton from "../../MainButton";
import Checkbox from "../../Checkbox";
import MainLayout from "../../layouts/MainLayout";
import RoundedButton from "../../RoundedButton";
import { useEffect, useRef, useState } from "react";
import MainTextArea from "../../MainTextArea";
import MainModal from "../../modals/MainModal";
import ErrorLabel from "../../ErrorLabel";
import apiClient from "../../services/apiClient";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import Swal from "sweetalert2";
import Skeleton from "../../Skeleton";

const ManageEvent = () => {
  // const inputFile = useRef(null);
  const uploadCover = useRef(null);
  const history = useHistory();

  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [choice, setChoice] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [isFree, setFree] = useState(false);
  const [isTicketGroup, setTicketGroup] = useState(0);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showFormatModal, setFormatShowModal] = useState(false);
  const [showDateModal, setDateShowModal] = useState(false);
  const [showLocationModal, setLocationShowModal] = useState(false);
  const [showTicketModal, setTicketShowModal] = useState(false);
  const [showEditTicketModal, setEditTicketShowModal] = useState(false);
  const [formData, setFormData] = useState({
    eventId: "",
    owner: "",
    banner: null,
    bannerUrl: "",
    isBannerUrlError: false,
    bannerUrlErrorLabel: false,
    title: "",
    isTitleError: false,
    titleErrorLabel: "",
    description: "",
    isDescriptionError: false,
    descriptionErrorLabel: "",
    isDescriptionOverChar: false,
    terms: "",
    isTermsError: false,
    isTermsOverChar: false,
    termsErrorLabel: "",
    // Format
    format: 1,
    isFormatError: false,
    formatErrorLabel: "",
    kategori: 1,
    isKategoriError: false,
    kategoriErrorLabel: "",
    // Date
    startDate: "",
    isStartDateError: false,
    startDateErrorLabel: "",
    startTime: "",
    isStartTimeError: false,
    startTimeErrorLabel: "",
    endDate: "",
    isEndDateError: false,
    endDateErrorLabel: "",
    endTime: "",
    isEndTimeError: false,
    endTimeErrorLabel: "",
    // Location
    location: "",
    isLocationError: false,
    locationErrorLabel: "",
    streamUrl: "",
    isStreamUrlError: false,
    streamUrlErrorLabel: "",
    // Ticket
    ticketId: "",
    ticketName: "",
    isTicketNameError: false,
    ticketNameErrorLabel: "",
    ticketType: 0,
    isTicketTypeError: false,
    ticketTypeErrorLabel: "",
    maxPerson: "",
    isMaxPersonError: false,
    maxPersonErrorLabel: "",
    priceTicket: "0",
    isPriceTicketError: false,
    priceTicketErrorLabel: "",
    ticketIsFree: false,
    amountTicket: 0,
    isAmountTicketError: false,
    amountTicketErrorLabel: "",
    startSaleTicket: "",
    isStartSaleTicketError: false,
    startSaleTicketErrorLabel: "",
    endSaleTicket: "",
    isEndSaleTicketError: false,
    endSaleTicketErrorLabel: "",
    deskripsiTicket: "",
    isDeskripsiTicketError: false,
    deskripsiTicketErrorLabel: "",
    // Add Participant
    columnName: "",
    isColumnNameError: false,
    columnNameErrorLabel: "",
    typeColumn: "",
    isTypeColumnError: false,
    typeColumnErrorLabel: "",
  });

  const [dataPeserta, setDataPeserta] = useState({
    name: true,
    email: true,
    hp: true,
    instansi: false,
    sex: false,
    birthday: false,
    ktp: false,
  });

  const [ticket, setTicket] = useState([]);
  const [info, setInfo] = useState([]);
  const [catFor, setAllCatFor] = useState([]);
  const { slug } = useParams();
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      apiClient
        .get("/api/v1/organization/event/" + slug)
        .then((response) => {
          setOnline(response.data.data.is_online);
          setFormData({
            eventId: response.data.data.id,
            owner: response.data.data.owner,
            bannerUrl: response.data.data.banner_url,
            title: response.data.data.title,
            description: response.data.data.description
              ? response.data.data.description
              : "",
            terms: response.data.data.terms ? response.data.data.terms : "",
            // Format
            format: response.data.data.format_id,
            kategori: response.data.data.category_id,
            // Date
            startDate: response.data.data.start_at
              ? response.data.data.start_at.split(" ")[0]
              : "",
            startTime: response.data.data.start_at
              ? response.data.data.start_at.split(" ")[1]
              : "",
            endDate: response.data.data.start_at
              ? response.data.data.end_at.split(" ")[0]
              : "",
            endTime: response.data.data.start_at
              ? response.data.data.end_at.split(" ")[1]
              : "",
            // Location
            location: response.data.data.location,
            streamUrl: response.data.data.stream_url,
          });
          setTicket(response.data.data.ticket);
          setInfo(response.data.data.APInformation);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            window.location.href = "/e/notfound";
          }
        });
    };
    const fetchAllCategoryFormat = async () => {
      await apiClient
        .get("/api/v1/organization/category/event")
        .then((response) => {
          setAllCatFor(response.data);
        });
    };
    fetchAllCategoryFormat();
    fetchData();
  }, [slug]);

  const handleSwal = (data, status) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: status ? status : "success",
      title: data,
    });
  };

  const handleUpdateTicketModal = (id) => {
    setEditTicketShowModal(true);
    const selectedTicket = ticket.filter((item, i) => item.id === id)[0];
    setFormData({
      ...formData,
      ticketId: selectedTicket.id,
      ticketName: selectedTicket.title,
      ticketType: selectedTicket.type,
      maxPerson: selectedTicket.max_person,
      priceTicket: selectedTicket.price,
      ticketIsFree: selectedTicket.is_free,
      amountTicket: selectedTicket.amount,
      startSaleTicket: selectedTicket.start_at.split(" ")[0],
      endSaleTicket: selectedTicket.end_at.split(" ")[0],
      deskripsiTicket: selectedTicket.description,
    });
  };

  const handleUpdateFormat = async () => {
    setProcessing(true);
    await apiClient
      .put("/api/v1/organization/event/" + slug, {
        format_id: formData.format,
        category_id: formData.kategori,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setFormatShowModal(false);
        setProcessing(false);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleUpdateDateTime = async () => {
    setProcessing(true);
    await apiClient
      .put("/api/v1/organization/event/" + slug, {
        start_at: formData.startDate + " " + formData.startTime,
        end_at: formData.endDate + " " + formData.endTime,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setDateShowModal(false);
        setProcessing(false);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleUpdateLocation = async () => {
    setProcessing(true);
    await apiClient
      .put("/api/v1/organization/event/" + slug, {
        location: formData.location,
        is_online: isOnline,
        stream_url: formData.streamUrl,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setLocationShowModal(false);
        setProcessing(false);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (
      file.size <= 5000000 &&
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    ) {
      const data = new FormData();
      data.append("banner_url", file);
      setFormData({
        ...formData,
        isBannerUrlError: false,
        bannerUrl: URL.createObjectURL(file),
        fileName: file.name,
      });
      handleUploadBanner(data, URL.createObjectURL(file));
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      handleSwal("Cuma boleh jpeg, jpg, atau png aja dibilangin!", "error");
    } else {
      handleSwal("File sizenya kegedean anj. Maks 5MB", "error");
    }
  };

  const handleUploadBanner = async (dataUpload, file) => {
    setUploading(true);
    await apiClient
      .post(`api/v1/user/poster-photos/event/${slug}`, dataUpload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUploading(false);
        }
      })
      .catch((error) => {
        setUploading(false);
      });
    setFormData({ ...formData, banner: null, bannerUrl: file });
  };

  const handleUpdateTicket = async (data, id) => {
    setProcessing(true);
    await apiClient
      .put("/api/v1/organization/event/ticket/" + id, data)
      .then((response) => {
        handleSwal(response.data.message);
        handleGetTicket();
        setEditTicketShowModal(false);
        setProcessing(false);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleAddTicket = async (data) => {
    setProcessing(true);
    await apiClient
      .post("/api/v1/organization/event/ticket", data)
      .then((response) => {
        handleSwal(response.data.message);
        setTicketShowModal(false);
        handleGetTicket();
        setProcessing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteTicket = async (id) => {
    await apiClient
      .delete("/api/v1/organization/event/ticket/" + id)
      .then((response) => {
        // setEditTicketShowModal(false);
        handleGetTicket();
        handleSwal(response.data.message);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleAddParticipantInfo = async () => {
    await apiClient
      .post("/api/v1/organization/event/part-information", {
        event_id: formData.eventId,
        title: formData.columnName,
        type: formData.typeColumn,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setShowAddParticipantModal(false);
        handleGetParticipantInfo();
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  // Add automatic additional information from first time event created
  const handleUpdateParticipantInfo = async (data) => {
    await apiClient.put(
      "/api/v1/organization/event/part-information/" + formData.eventId,
      data
    );
  };

  const handleDeleteParticipantInfo = async (id) => {
    await apiClient
      .delete("/api/v1/organization/event/part-information/" + id)
      .then((response) => {
        handleSwal(response.data.message);
        handleGetParticipantInfo();
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleGetParticipantInfo = async () => {
    await apiClient
      .get("/api/v1/organization/event/part-information/" + formData.eventId)
      .then((response) => {
        setInfo(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleGetTicket = async () => {
    await apiClient
      .get("/api/v1/organization/event/ticket/" + formData.eventId)
      .then((response) => {
        setTicket(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleUpdate = (e) => {
    setDataPeserta({
      ...dataPeserta,
      [e.target.name]: e.target.checked,
    });
    const updatedData = {
      [e.target.name]: e.target.checked,
    };
    handleUpdateParticipantInfo(updatedData);
  };

  const handleSubmit = () => {
    switch (true) {
      case showAddParticipantModal:
        if (formData.columnName && formData.typeColumn) {
          handleAddParticipantInfo();
        } else if (!formData.columnName) {
          setFormData({
            ...formData,
            isColumnNameError: true,
            columnNameErrorLabel: "Kolom namanya apa anj.",
          });
        } else if (!formData.typeColumn) {
          setFormData({
            ...formData,
            isColumnNameError: true,
            columnNameErrorLabel: "Tipe kolomnya juga dong diisi",
          });
        }
        break;
      case showFormatModal:
        if (formData.format && formData.kategori) {
          handleUpdateFormat();
        } else if (!formData.format) {
          setFormData({
            ...formData,
            isFormatError: true,
            formatErrorLabel: "Format event jangan lupa sayang",
          });
        } else if (!formData.kategori) {
          setFormData({
            ...formData,
            isKategoriError: true,
            kategoriErrorLabel: "Kategorinya juga diisi, ish",
          });
        }
        break;
      case showDateModal:
        if (
          formData.startDate &&
          formData.startTime &&
          formData.endDate &&
          formData.endTime
        ) {
          handleUpdateDateTime();
        } else if (!formData.startDate) {
          setFormData({
            ...formData,
            isStartDateError: true,
            startDateErrorLabel: "Kapan anj gaisi tanggal",
          });
        } else if (!formData.startTime) {
          setFormData({
            ...formData,
            isStartTimeError: true,
            startTimeErrorLabel: "Jam berapa nih? yakalik jam 12 malem",
          });
        } else if (!formData.endDate) {
          setFormData({
            ...formData,
            isEndDateError: true,
            endDateErrorLabel: "Berhenti kapan ni? emang jalan sampe kiamat?",
          });
        } else if (!formData.endTime) {
          setFormData({
            ...formData,
            isEndTimeError: true,
            endTimeErrorLabel: "Waktu juga dong diisi sayang",
          });
        }
        break;
      case showLocationModal:
        if (!formData.location) {
          setFormData({
            ...formData,
            isLocationError: true,
            locationErrorLabel: "Lokasi kok gaisi :(",
          });
        } else if (isOnline && !formData.streamUrl) {
          setFormData({
            ...formData,
            isStreamUrlError: true,
            streamUrlErrorLabel: "Stream URL diisi juga lah",
          });
        } else {
          handleUpdateLocation();
        }
        break;
      case showTicketModal || showEditTicketModal:
        if (
          formData.ticketName &&
          formData.amountTicket > 0 &&
          formData.startSaleTicket &&
          formData.endSaleTicket &&
          formData.deskripsiTicket
        ) {
          let amount = formData.priceTicket.toString().replace(/\D/g, "");
          const dataUpload = {
            title: formData.ticketName,
            description: formData.deskripsiTicket,
            price: parseInt(amount),
            amount: formData.amountTicket,
            start_at: formData.startSaleTicket,
            end_at: formData.endSaleTicket,
            type: formData.ticketType,
            is_free:
              parseInt(amount) === 0
                ? true
                : formData.ticketIsFree
                ? formData.ticketIsFree
                : false,
            event_id: formData.eventId,
          };
          showEditTicketModal
            ? handleUpdateTicket(dataUpload, formData.ticketId)
            : handleAddTicket(dataUpload);
        } else if (!formData.ticketName) {
          setFormData({
            ...formData,
            isTicketNameError: true,
            ticketNameErrorLabel: "Nama tiketnya apa?",
          });
        } else if (!formData.priceTicket && !formData.ticketIsFree) {
          setFormData({
            ...formData,
            isPriceTicketError: true,
            priceTicketErrorLabel: "Harga tiketnya woi",
          });
        } else if (formData.amountTicket <= 0) {
          setFormData({
            ...formData,
            isAmountTicketError: true,
            amountTicketErrorLabel: "Jumlah maksimal tiket diisi dong",
          });
        } else if (!formData.startSaleTicket) {
          setFormData({
            ...formData,
            isStartSaleTicketError: true,
            startSaleTicketErrorLabel: "Kapan mulai dijual nih tiketnya?",
          });
        } else if (!formData.endSaleTicket) {
          setFormData({
            ...formData,
            isEndSaleTicketError: true,
            endSaleTicketErrorLabel: "Kapan berakhir jual tiketnya ni?",
          });
        } else if (!formData.deskripsiTicket) {
          setFormData({
            ...formData,
            isDeskripsiTicketError: true,
            deskripsiTicketErrorLabel:
              "Jelasin deng tiketnya nanti pesertanya bingung lo :(",
          });
        }
        break;

      default:
        break;
    }
  };

  const handleFinish = async (id) => {
    if (!formData.startDate && !formData.endDate) {
      handleSwal("Isi nae tanggal mulai & selesainya kapan hmm", "warning");
    } else if (!formData.format && !formData.kategori) {
      handleSwal("Isi nae kategori & format juga!", "warning");
    } else if (!formData.location) {
      handleSwal("Lokasi dimana nih? kok gaisi", "warning");
    } else if (ticket.length < 1) {
      handleSwal(
        "Kamu ga jual tiket? Masa engga, aneh banget ni event",
        "warning"
      );
    } else if (!formData.bannerUrl) {
      handleSwal("Isiin nae banner/poster juga biar keren", "warning");
    } else {
      if (formData.description && formData.terms && formData.title) {
        await apiClient
          .put("/api/v1/organization/event/" + slug, {
            status: id,
            title: formData.title,
            description: formData.description,
            terms: formData.terms,
          })
          .then((response) => {
            handleSwal(response.data.message);
            history.push("/admin/event");
            // console.log(response.data);
          })
          .catch((error) => {
            // console.log(error.response);
            handleSwal("Terjadi kesalahan pada server", "error");
          });
      } else if (!formData.description) {
        handleSwal(
          "Jelasin deng eventnya nanti pesertanya bingung lo :(",
          "warning"
        );
      } else if (!formData.terms) {
        handleSwal(
          "Jelasin deng ketentuannya juga, nanti kena masalah nangess :(",
          "warning"
        );
      } else if (!formData.title) {
        handleSwal(
          "Ibarat hubungan tanpa status, ini gak isi judul nanti pesertanya bingung lah ini apa??",
          "warning"
        );
      }
    }
  };

  return (
    <MainLayout top={true} footer={true}>
      <MainModal
        onClick={handleSubmit}
        buttonLabel={processing ? "Loading..." : "Simpan"}
        title={
          showAddParticipantModal
            ? "Tambahkan info peserta"
            : showFormatModal
            ? "Format event"
            : showDateModal
            ? "Kapan event ini sih?"
            : showLocationModal
            ? "Dimana lokasinya?"
            : showTicketModal
            ? "Buat tiket"
            : "Edit tiket"
        }
        handleClose={() => {
          showAddParticipantModal
            ? setShowAddParticipantModal(false)
            : showFormatModal
            ? setFormatShowModal(false)
            : showDateModal
            ? setDateShowModal(false)
            : showLocationModal
            ? setLocationShowModal(false)
            : showTicketModal
            ? setTicketShowModal(false)
            : setEditTicketShowModal(false);
        }}
        showModal={
          showAddParticipantModal ||
          showFormatModal ||
          showDateModal ||
          showLocationModal ||
          showTicketModal ||
          showEditTicketModal
        }
      >
        {showAddParticipantModal ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="my-2 col-span-2">
              <Label label="Nama Kolom" />
              <MainInput
                type="text"
                name="columnName"
                value={formData.columnName}
                onChange={(e) => {
                  setFormData({ ...formData, columnName: e.target.value });
                }}
              />
              {formData.isColumnNameError ? (
                <ErrorLabel label={formData.columnNameErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="my-2">
              <Label label="Tipe" />
              <SelectInput
                name="typeColumn"
                value={formData.typeColumn}
                onChange={(e) => {
                  setFormData({ ...formData, typeColumn: e.target.value });
                }}
              >
                <option defaultValue="">Pilih tipe kolom</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="date">File</option>
              </SelectInput>
              {formData.isTypeColumnError ? (
                <ErrorLabel label={formData.typeColumnErrorLabel} />
              ) : (
                ""
              )}
            </div>
          </div>
        ) : showFormatModal ? (
          <div>
            <div className="my-2">
              <Label label="Format" />
              <SelectInput
                name="format"
                value={formData.format}
                onChange={(e) => {
                  setFormData({ ...formData, format: e.target.value });
                }}
              >
                <option value={""}>Pilih format</option>
                {catFor.format.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </SelectInput>
              {formData.isFormatError ? (
                <ErrorLabel label={formData.formatErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="my-2">
              <Label label="Kategori" />
              <SelectInput
                type="text"
                name="kategori"
                value={formData.kategori}
                onChange={(e) => {
                  setFormData({ ...formData, kategori: e.target.value });
                }}
              >
                <option value={""}>Pilih kategori</option>
                {catFor.category.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </SelectInput>
              {formData.isKategoriError ? (
                <ErrorLabel label={formData.kategoriErrorLabel} />
              ) : (
                ""
              )}
            </div>
          </div>
        ) : showDateModal ? (
          <div>
            <div className="grid grid-cols-3 gap-2">
              <div className="my-2 col-span-2">
                <Label label="Tanggal Mulai" />
                <MainInput
                  min={moment().format("YYYY-MM-DD")}
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({ ...formData, startDate: e.target.value });
                  }}
                />
                {formData.isStartDateError ? (
                  <ErrorLabel label={formData.startDateErrorLabel} />
                ) : (
                  ""
                )}
              </div>
              <div className="my-2 col-span-1">
                <Label label="Waktu Mulai" />
                <MainInput
                  min={moment().format("h:mm")}
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={(e) => {
                    setFormData({ ...formData, startTime: e.target.value });
                  }}
                />
                {formData.isStartTimeError ? (
                  <ErrorLabel label={formData.startTimeErrorLabel} />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="my-2 col-span-2">
                <Label label="Tanggal Selesai" />
                <MainInput
                  min={moment().add(1, "days").format("YYYY-MM-DD")}
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({ ...formData, endDate: e.target.value });
                  }}
                />
                {formData.isEndDateError ? (
                  <ErrorLabel label={formData.endDateErrorLabel} />
                ) : (
                  ""
                )}
              </div>
              <div className="my-2 col-span-1">
                <Label label="Waktu Selesai" />
                <MainInput
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={(e) => {
                    setFormData({ ...formData, endTime: e.target.value });
                  }}
                />
                {formData.isEndTimeError ? (
                  <ErrorLabel label={formData.endTimeErrorLabel} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ) : showLocationModal ? (
          <div>
            <div className="my-2">
              <Checkbox
                onChange={() => {
                  setOnline((isOnline) => !isOnline);
                }}
                checked={isOnline}
                label="Event ini online"
              />
            </div>
            <div className="my-2">
              <Label label={`Nama ${isOnline ? `Platform` : `Tempat`}`} />
              <MainInput
                type="text"
                placeholder={
                  isOnline ? "Ex: Google Meet" : "Ex: Aula Ternak Ayam Holdings"
                }
                name="location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                }}
              />
              {formData.isLocationError ? (
                <ErrorLabel label={formData.locationErrorLabel} />
              ) : (
                ""
              )}
            </div>
            {isOnline ? (
              <div className="my-2">
                <Label label="Link Streaming" />
                <MainInput
                  type="text"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, streamUrl: e.target.value });
                  }}
                />
                {formData.isStreamUrlError ? (
                  <ErrorLabel label={formData.streamUrlErrorLabel} />
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div>
                {/*                <div className="mt-4">
                  <div className="w-full h-64 bg-gray-200"></div>
                </div>*/}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="my-2">
              <Label label="Nama Tiket" />
              <MainInput
                type="text"
                name="ticketName"
                value={formData.ticketName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    ticketName: e.target.value,
                    isTicketNameError: false,
                  });
                }}
              />
              {formData.isTicketNameError ? (
                <ErrorLabel label={formData.ticketNameErrorLabel} />
              ) : (
                ""
              )}
            </div>
            {/* <div
              className={
                isTicketGroup === `1`
                  ? `grid grid-cols-1 md:grid-cols-2 gap-2`
                  : ``
              }
            >
              <div className="my-2">
                <Label label="Tipe Tiket" />
                <SelectInput
                  onChange={(e) => {
                    setTicketGroup(e.target.value);
                    setFormData({
                      ...formData,
                      ticketType: e.target.value,
                    });
                  }}
                  type="text"
                  name="ticketType"
                  value={formData.ticketType}
                >
                  <option value={0}>Per orang</option>
                  <option value={1}>Per tim</option>
                </SelectInput>
                {formData.isTicketTypeError ? (
                  <ErrorLabel label={formData.ticketTypeErrorLabel} />
                ) : (
                  ""
                )}
              </div>
              {isTicketGroup === "1" ? (
                <div className="my-2">
                  <Label label="Maksimal orang dalam tim" />
                  <MainInput
                    type="text"
                    name="maxPerson"
                    value={formData.maxPerson}
                    onChange={(e) => {
                      setFormData({ ...formData, maxPerson: e.target.value });
                    }}
                  />
                  {formData.isMaxPersonError ? (
                    <ErrorLabel label={formData.maxPersonErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div> */}
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div className="my-2">
                  <Label label="Harga Tiket" />
                  <CurrencyFormat
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        priceTicket: e.target.value,
                        isPriceTicketError: false,
                      });
                    }}
                    name="priceTicket"
                    disabled={formData.ticketIsFree}
                    thousandSeparator={true}
                    prefix={"Rp"}
                    value={formData.priceTicket}
                    customInput={MainInput}
                  />
                  {formData.isPriceTicketError ? (
                    <ErrorLabel label={formData.priceTicketErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>
                <div className="my-2">
                  <Label label="Jumlah Tiket" />
                  <CurrencyFormat
                    customInput={MainInput}
                    type="text"
                    name="amountTicket"
                    value={formData.amountTicket}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        amountTicket: e.target.value,
                        isAmountTicketError: false,
                      });
                    }}
                  />
                  {formData.isAmountTicketError ? (
                    <ErrorLabel label={formData.amountTicketErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div>
                <Checkbox
                  label="Tiket ini gratis"
                  onChange={(e) => {
                    setFree((isFree) => !isFree);
                    setFormData({
                      ...formData,
                      ticketIsFree: e.target.checked,
                      priceTicket: "0",
                    });
                  }}
                  checked={formData.ticketIsFree}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                <div className="my-2">
                  <Label label="Mulai Dijual" />
                  <MainInput
                    min={moment().format("YYYY-MM-DD")}
                    type="date"
                    name="startSaleTicket"
                    value={formData.startSaleTicket}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        startSaleTicket: e.target.value,
                        isStartSaleTicketError: false,
                      });
                    }}
                  />
                  {formData.isStartSaleTicketError ? (
                    <ErrorLabel label={formData.startSaleTicketErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>
                <div className="my-2">
                  <Label label="Berakhir Dijual" />
                  <MainInput
                    min={moment().add(1, "days").format("YYYY-MM-DD")}
                    type="date"
                    name="endSaleTicket"
                    value={formData.endSaleTicket}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        endSaleTicket: e.target.value,
                        isEndSaleTicketError: false,
                      });
                    }}
                  />
                  {formData.isEndSaleTicketError ? (
                    <ErrorLabel label={formData.endSaleTicketErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="my-2">
                <Label label="Deskripsi" />
                <MainTextArea
                  className="resize-none"
                  type="text"
                  name="deskripsiTicket"
                  value={formData.deskripsiTicket}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      deskripsiTicket: e.target.value,
                      isDeskripsiTicketError: false,
                    });
                  }}
                />
                {formData.isDeskripsiTicketError ? (
                  <ErrorLabel label={formData.deskripsiTicketErrorLabel} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </MainModal>
      <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
        <div className="my-12">
          <div className="mt-4 mx-4 md:mx-0">
            <div className="grid md:grid-cols-3 grid-cols-1 md:gap-4">
              <div
                className={`w-full h-72 bg-gray-400 mx-auto xl:mx-0 rounded`}
              >
                {!formData.bannerUrl ? (
                  ""
                ) : (
                  <img
                    className="w-full h-full rounded object-cover"
                    src={formData.bannerUrl}
                    alt="Icon"
                  />
                )}
                <input
                  type="file"
                  className="hidden"
                  ref={uploadCover}
                  onChange={handleUploadFile}
                  value={formData.banner}
                />
                {isLoading ? (
                  ""
                ) : (
                  <div
                    className={`flex justify-end ${
                      !formData.bannerUrl ? "" : "py-4"
                    }`}
                  >
                    <MainButton
                      onClick={(e) => {
                        uploadCover.current && uploadCover.current.click();
                      }}
                      label={
                        isUploading
                          ? `Mengupload... ${progress}`
                          : `Ganti Poster`
                      }
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
              <div className="my-8 col-span-2">
                <h2 className="font-bold text-2xl">Info dasar event</h2>
                <div className="my-4">
                  <div className="grid md:grid-cols-5 grid-cols-1 md:gap-2">
                    <div className="col-span-4 my-2">
                      {isLoading ? (
                        <Skeleton className="w-24 h-4 rounded" count="1" />
                      ) : (
                        <Label label="Judul Event" />
                      )}
                      {isLoading ? (
                        <Skeleton className="w-full h-10 rounded" count="1" />
                      ) : (
                        <MainInput
                          type="text"
                          name="info"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                          }}
                        />
                      )}
                      {formData.isTitleError ? (
                        <ErrorLabel label={formData.titleErrorLabel} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-span-1 my-2">
                      {isLoading ? (
                        <Skeleton className="w-24 h-4 rounded" count="1" />
                      ) : (
                        <Label label="Format Event" />
                      )}
                      {isLoading ? (
                        <Skeleton className="w-full h-10 rounded" count="1" />
                      ) : (
                        <MainButton
                          className="w-full"
                          onClick={() => {
                            setFormatShowModal(true);
                          }}
                          label="Pilih format"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <div className="grid md:grid-cols-5 grid-cols-2 gap-2">
                    <div className="col-span-2">
                      {isLoading ? (
                        <Skeleton className="w-28 h-4 rounded" count="1" />
                      ) : (
                        <Label label="Penyelenggara" />
                      )}
                      {isLoading ? (
                        <Skeleton className="w-48 h-6 rounded" count="1" />
                      ) : (
                        <h2 className="font-semibold text-xl">
                          {formData.owner}
                        </h2>
                      )}
                    </div>
                    <div className="col-span-2 my-2">
                      {isLoading ? (
                        <Skeleton className="w-32 h-4 rounded" count="1" />
                      ) : (
                        <Label label="Tanggal & Waktu" />
                      )}
                      {isLoading ? (
                        <Skeleton className="w-48 h-10 rounded" count="1" />
                      ) : (
                        <MainButton
                          onClick={() => {
                            setDateShowModal(true);
                          }}
                          label="Pilih tanggal & waktu"
                        />
                      )}
                    </div>
                    <div className="col-span-1 my-2">
                      {isLoading ? (
                        <Skeleton className="w-24 h-4 rounded" count="1" />
                      ) : (
                        <Label label="Lokasi" />
                      )}
                      {isLoading ? (
                        <Skeleton className="w-full h-10 rounded" count="1" />
                      ) : (
                        <MainButton
                          onClick={() => {
                            setLocationShowModal(true);
                          }}
                          className="w-full"
                          label="Pilih lokasi"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="font-bold text-2xl">Info tiket pendaftaran</h2>
              <div className="my-4">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                  {/* Ticket Start */}
                  {isLoading ? (
                    <Skeleton className="w-full h-44 rounded" count="3" />
                  ) : (
                    ticket.map((item, i) => (
                      <div
                        className="w-full border rounded grid grid-cols-4 gap-2 p-3"
                        key={i}
                      >
                        <div className="border-r pr-3 col-span-1">
                          <div>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/gerra-14Artboard 1.png"
                              }
                              alt=""
                            />
                            <div className="text-center">
                              <span className="text-xs">
                                Powered by Tokoevent
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pl-3 col-span-3">
                          <div className="pb-3 border-b flex justify-between">
                            <div>
                              <span className="text-lg font-semibold">
                                {item.title.substring(0, 20)}{" "}
                                {item.title.length > 20 ? "..." : ""}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <RoundedButton
                                className="w-8 h-8"
                                onClick={() => {
                                  handleUpdateTicketModal(item.id);
                                }}
                              >
                                {isLoading ? (
                                  ""
                                ) : (
                                  <img
                                    className="w-4 h-4"
                                    src={process.env.PUBLIC_URL + "/edit.svg"}
                                    alt="Icon"
                                  />
                                )}
                              </RoundedButton>
                              <RoundedButton
                                className="w-8 h-8"
                                onClick={() => {
                                  handleDeleteTicket(item.id);
                                }}
                              >
                                <img
                                  className="w-4 h-4"
                                  src={process.env.PUBLIC_URL + "/trash.svg"}
                                  alt="Icon"
                                />
                              </RoundedButton>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-light">
                              {item.description.substring(0, 80)}{" "}
                              {item.description.length > 80 ? "..." : ""}
                            </span>
                          </div>
                          <div className="flex justify-between bottom-0 mt-4">
                            <div>
                              <span className="text-sm font-light text-blue-600">
                                Dijual {moment(item.start_at).format("ll")}
                              </span>
                            </div>
                            <div>
                              <span className="text-lg font-semibold">
                                <CurrencyFormat
                                  value={item.price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"Rp"}
                                />
                                {"/"}
                                <span className="text-xs">
                                  {item.type === 0 ? "Orang" : "Tim"}
                                </span>{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Ticket End */}
                </div>
                {ticket.length < 3 ? (
                  <div className="flex justify-center my-8">
                    {isLoading ? (
                      <Skeleton className="w-52 h-10 rounded" count="1" />
                    ) : (
                      <MainButton
                        onClick={() => {
                          setFormData({
                            ...formData,
                            ticketId: "",
                            ticketName: "",
                            ticketType: "0",
                            maxPerson: "",
                            priceTicket: "0",
                            ticketIsFree: false,
                            amountTicket: 0,
                            startSaleTicket: "",
                            endSaleTicket: "",
                            deskripsiTicket: "",
                          });
                          setTicketShowModal(true);
                        }}
                        label="Buat Tiket Pendaftaran"
                      />
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="mt-16">
              <h2 className="font-bold text-2xl">Info peserta</h2>
              <div className="my-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex">
                    <Checkbox
                      checked={dataPeserta.name}
                      label={"Name"}
                      disabled={true}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      checked={dataPeserta.email}
                      label={"Email"}
                      disabled={true}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      checked={dataPeserta.hp}
                      label={"No. Telepon"}
                      disabled={true}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      name="instansi"
                      onChange={handleUpdate}
                      checked={dataPeserta.instansi}
                      label={"Nama Instansi"}
                      disabled={false}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      name="sex"
                      onChange={handleUpdate}
                      checked={dataPeserta.sex}
                      label={"Jenis Kelamin"}
                      disabled={false}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      name="birthday"
                      onChange={handleUpdate}
                      checked={dataPeserta.birthday}
                      label={"Tanggal Lahir"}
                      disabled={false}
                    />
                  </div>
                  <div className="flex">
                    <Checkbox
                      name="ktp"
                      onChange={handleUpdate}
                      checked={dataPeserta.ktp}
                      label={"No. KTP"}
                      disabled={false}
                    />
                  </div>
                </div>

                {/* <div className="flex justify-center my-4">
                  {isLoading ? (
                    <Skeleton className="w-48 h-10 rounded" count="1" />
                  ) : (
                    <MainButton
                      onClick={() => {
                        setShowAddParticipantModal(true);
                      }}
                      label="Tambah info peserta"
                    />
                  )}
                </div> */}
              </div>
            </div>
            <div className="mt-16">
              <h2 className="font-bold text-2xl">Detail event</h2>
              <div className="my-4">
                <div className="flex justify-center gap-2">
                  {isLoading ? (
                    <Skeleton className="w-24 h-10 rounded" count="1" />
                  ) : (
                    <MainButton
                      onClick={() => {
                        setChoice(0);
                      }}
                      label="Deskripsi"
                    />
                  )}
                  {isLoading ? (
                    <Skeleton className="w-48 h-10 rounded" count="1" />
                  ) : (
                    <MainButton
                      onClick={() => {
                        setChoice(1);
                      }}
                      label="Syarat & Ketentuan"
                    />
                  )}
                </div>
              </div>
              <div className="w-full border rounded-lg p-4">
                <div>
                  <h2 className="font-semibold text-center text-lg pb-4">
                    {choice === 0 ? "Deskripsi" : "Syarat & Ketentuan"}
                  </h2>
                </div>
                {isLoading ? (
                  <Skeleton className="w-full h-24 rounded" count="1" />
                ) : choice === 0 ? (
                  <div>
                    <MainTextArea
                      className="h-48"
                      key="1"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length > 1808) {
                          setFormData({
                            ...formData,
                            isDescriptionOverChar: true,
                            isDescriptionError: true,
                            descriptionErrorLabel:
                              "Gak boleh lebih dari 1808 karakter",
                          });
                        } else {
                          setFormData({
                            ...formData,
                            description: e.target.value,
                            isDescriptionOverChar: false,
                            isDescriptionError: false,
                          });
                        }
                      }}
                    />
                    <div className="flex justify-between">
                      <ErrorLabel
                        label={
                          formData.isDescriptionError
                            ? formData.descriptionErrorLabel
                            : ""
                        }
                      />

                      <span
                        className={`text-sm flex ${
                          formData.isDescriptionOverChar ? "text-red-600" : ""
                        }`}
                      >
                        {formData.description.length}/1808
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <MainTextArea
                      className="h-48"
                      key="2"
                      type="text"
                      name="terms"
                      value={formData.terms}
                      onChange={(e) => {
                        if (e.target.value.length > 1808) {
                          setFormData({
                            ...formData,
                            isTermsOverChar: true,
                            isTermsError: true,
                            termsErrorLabel:
                              "Gak boleh lebih dari 1808 karakter",
                          });
                        } else {
                          setFormData({
                            ...formData,
                            terms: e.target.value,
                            isTermsOverChar: false,
                            isTermsError: false,
                          });
                        }
                      }}
                    />
                    <div className="flex justify-between">
                      <ErrorLabel
                        label={
                          formData.isTermsError ? formData.termsErrorLabel : ""
                        }
                      />

                      <span
                        className={`text-sm flex ${
                          formData.isTermsOverChar ? "text-red-600" : ""
                        }`}
                      >
                        {formData.terms.length}/1808
                      </span>
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  {/* File Upload */}
                  {/* <div className="flex justify-between">
                    <input
                      type="file"
                      name="files"
                      className="hidden"
                      ref={inputFile}
                      // onChange={handlePreview}
                    />
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        inputFile.current && inputFile.current.click();
                      }}
                    >
                      <div className="font-bold text-blue-600 hover:text-blue-500 duration-200">
                        Tambahkan file
                      </div>
                      <div className="text-sm">hanya menerima .pdf .docs</div>
                    </div>
                    <div>
                      <RoundedButton className="w-12 h-12">
                        <img
                          className="h-8 w-8 p-1"
                          src={process.env.PUBLIC_URL + "/trash.svg"}
                          alt="Icon"
                        />
                      </RoundedButton>
                    </div>
                  </div> */}
                  {/* File upload */}
                </div>
              </div>
            </div>
            <div className="my-16">
              <div className="flex justify-center gap-2">
                {isLoading ? (
                  <Skeleton className="w-48 h-10 rounded" count="1" />
                ) : (
                  <MainButton
                    onClick={() => {
                      handleFinish(0);
                    }}
                    label="Simpan sebagai draf"
                  />
                )}
                {isLoading ? (
                  <Skeleton className="w-48 h-10 rounded" count="1" />
                ) : (
                  <MainButton
                    onClick={() => {
                      handleFinish(1);
                    }}
                    label="Simpan & publikasikan"
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
export default ManageEvent;

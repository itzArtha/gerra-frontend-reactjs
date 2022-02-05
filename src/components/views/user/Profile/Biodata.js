import RoundedButton from "../../../RoundedButton";
import ErrorLabel from "../../../ErrorLabel";
import Skeleton from "../../../Skeleton";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MainModal from "../../../modals/MainModal";
import TransparentButton from "../../../TransparentButton";
import MainInput from "../../../MainInput";
import Label from "../../../Label";
import MainButton from "../../../MainButton";
import apiClient from "../../../services/apiClient";
import QRCode from "qrcode.react";
import Swal from "sweetalert2";
import moment from "moment";
import Radio from "../../../Radio";

const Biodata = () => {
  const [isTextLoading, setTextLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQRcodeModal, setQRcodeModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputProfilFoto = useRef(null);
  const [formData, setformData] = useState({
    file: null,
    fileUrl: "",
    bannerUrl: "",
    fileName: "",
    isFileError: false,
    fileErrorLabel: "",
    name: "",
    isNameError: false,
    nameErrorLabel: "",
    email: "",
    isEMailError: false,
    emailErrorLabel: "",
    phone: "",
    isPhoneError: false,
    phoneErrorLabel: "",
    birthday: "",
    isBirthdayError: false,
    birthdayErrorLabel: "",
    sex: null,
    isSexError: false,
    sexErrorLabel: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("api/v1/user")
        .then((response) => {
          setData(response.data.data);
          setformData({
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
            birthday: response.data.data.birthday,
            sex: response.data.data.sex,
          });
          setLoading(false);
        })
        .catch((error) => {
          //
        });
    };

    setLoading(true);
    fetchData();
  }, [setData]);

  const refreshData = async () => {
    await apiClient
      .get("api/v1/user")
      .then((response) => {
        setData(response.data.data);
        setformData({
          name: response.data.data.name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          birthday: response.data.data.birthday,
          sex: response.data.data.sex,
        });
        setLoading(false);
      })
      .catch((error) => {
        //
      });
  };

  const handleSubmitContact = () => {
    if (formData.email) {
      setformData({
        ...formData,
        isEmailError: false,
      });
      updateContactHandler();
    } else if (!formData.email) {
      setformData({
        ...formData,
        isEmailError: true,
        emailErrorLabel: "Dibilangin email ga boleh kosong",
      });
    }
  };

  const handleVerifikasi = async () => {
    setTextLoading(true);
    await apiClient
      .get("/api/v1/email/resend")
      .then((response) => {
        handleSwal(response.data.message);
        setTextLoading(false);
      })
      .catch((error) => {
        handleSwal(error.response.data.message, "error");
      });
  };

  const handleSubmitInformation = () => {
    if (formData.name) {
      setformData({
        ...formData,
        isNameError: false,
      });
      updateProfileHandler();
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Nama ga boleh kosong dibilangin!",
      });
    }
  };

  const updateContactHandler = async () => {
    setTextLoading(true);
    await apiClient
      .put("api/v1/user/contact", {
        email: formData.email,
        phone: formData.phone,
      })
      .then((response) => {
        handleSwal(response.data.message);
        refreshData();
        setShowContactModal(false);
        setTextLoading(false);
      })
      .catch((error) => {
        // console.log(error.response.data);
        if (error.response.status === 422) {
          if (error.response.data.email) {
            setformData({
              ...formData,
              isEmailError: true,
              emailErrorLabel:
                "Email sudah digunakan ya gan, pake yang lain aja",
            });
          }
          if (error.response.data.phone) {
            setformData({
              ...formData,
              isPhoneError: true,
              phoneErrorLabel:
                "No. Telepon sudah digunakan ya gan, pake yang lain aja",
            });
          }
        }
      });
  };

  const updateProfileHandler = async () => {
    setTextLoading(true);
    await apiClient
      .put("api/v1/user/profile", {
        name: formData.name,
        birthday: formData.birthday,
        sex: formData.sex,
      })
      .then((response) => {
        handleSwal(response.data.message);
        refreshData();
        setShowProfileModal(false);
        setTextLoading(false);
      })
      .catch((error) => {
        // console.log(error.response);
      });
  };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (
      file.size <= 5000000 &&
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    ) {
      const data = new FormData();
      name === "photo_url"
        ? data.append("photo_url", file)
        : data.append("banner_url", file);
      name === "photo_url"
        ? setformData({
            ...formData,
            isFileError: false,
            fileUrl: URL.createObjectURL(file),
            fileName: file.name,
          })
        : setformData({
            ...formData,
            isFileError: false,
            bannerUrl: URL.createObjectURL(file),
            fileName: file.name,
          });
      handleUploadFile(data, name);
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      handleSwal("Cuma boleh jpeg, jpg, atau png aja dibilangin!", "error");
    } else {
      handleSwal("File sizenya kegedean anj. Maks 5MB", "error");
    }
  };

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

  const handleUploadFile = async (dataUpload, name) => {
    setUploading(true);
    await apiClient
      .post(`api/v1/user/profile-photos`, dataUpload, {
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
          refreshData();
          // console.log(response);
        }
      })
      .catch((error) => {
        setformData({
          ...formData,
          fileUrl: "",
          file: "",
        });
        setUploading(false);
        // setShowModal(true);
      });
  };

  return (
    <>
      <MainModal
        showModal={showProfileModal || showContactModal}
        handleClose={() => {
          showProfileModal
            ? setShowProfileModal(false)
            : setShowContactModal(false);
        }}
        buttonLabel={isTextLoading ? "Loading..." : "Simpan"}
        title={
          showProfileModal ? "Ubah Informasi Personal" : "Ubah Informasi Kontak"
        }
        button={true}
        onClick={() => {
          showProfileModal ? handleSubmitInformation() : handleSubmitContact();
        }}
      >
        {showProfileModal ? (
          <div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-28 h-2 rounded" count={1} />
              ) : (
                <Label label="Nama Lengkap" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <MainInput
                  value={formData.name}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      name: e.target.value,
                      isNameError: false,
                    })
                  }
                  name="name"
                  type="text"
                />
              )}
              {formData.isNameError ? (
                <ErrorLabel label={formData.nameErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-14 h-2 rounded" count={1} />
              ) : (
                <Label label="Tanggal Lahir" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <MainInput
                  value={
                    formData.birthday
                      ? formData.birthday.split(" ")[0]
                      : formData.birthday
                  }
                  onChange={(e) => {
                    setformData({
                      ...formData,
                      isBirthdayError: false,
                      birthday: e.target.value,
                    });
                  }}
                  name="birthday"
                  type="date"
                />
              )}
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-16 h-2 rounded" count={1} />
              ) : (
                <Label label="Jenis Kelamin" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <div>
                  <Radio
                    onChange={(e) => {
                      setformData({ ...formData, sex: e.target.value });
                    }}
                    name="SexType"
                    label={"Perempuan"}
                    value="0"
                    checked={parseInt(formData.sex) === 0 ? true : false}
                  />
                  <Radio
                    onChange={(e) => {
                      setformData({ ...formData, sex: e.target.value });
                    }}
                    name="SexType"
                    label={"Laki - Laki"}
                    value="1"
                    checked={parseInt(formData.sex) === 1 ? true : false}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="pb-4">
              {isLoading ? (
                <Skeleton className="w-16 h-2 rounded" count={1} />
              ) : (
                <Label label="Email" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <MainInput
                  value={formData.email}
                  type="text"
                  onChange={(e) => {
                    setformData({
                      ...formData,
                      email: e.target.value,
                      isEmailError: false,
                    });
                  }}
                />
              )}
              {formData.isEmailError ? (
                <ErrorLabel label={formData.emailErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="pb-4">
              {isLoading ? (
                <Skeleton className="w-20 h-2 rounded" count={1} />
              ) : (
                <Label label="No. Telepon" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <MainInput
                  value={formData.phone}
                  type="text"
                  onChange={(e) => {
                    setformData({
                      ...formData,
                      phone: e.target.value,
                      isPhoneError: false,
                    });
                  }}
                />
              )}
              {formData.isPhoneError ? (
                <ErrorLabel label={formData.phoneErrorLabel} />
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </MainModal>

      <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
        <div className="mx-auto">
          <div className="w-full mx-auto xl:mx-0">
            <div className={`rounded relative mt-8 h-24`}>
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
                        formData.fileUrl
                          ? formData.fileUrl
                          : data.photo_url
                          ? data.photo_url
                          : `https://avatars.dicebear.com/api/bottts/${data.name}.svg`
                      }
                      alt="Profil"
                      className="absolute z-0 h-full w-full object-cover rounded-full shadow top-0 left-0 bottom-0 right-0"
                    />
                    <div className="cursor-pointer flex flex-col justify-center items-center z-10 text-gray-100">
                      <input
                        type="file"
                        name="photo_url"
                        className="hidden"
                        ref={inputProfilFoto}
                        onChange={handlePreview}
                      />
                      {isUploading ? (
                        <div></div>
                      ) : (
                        <RoundedButton
                          type="button"
                          onClick={(e) => {
                            inputProfilFoto.current &&
                              inputProfilFoto.current.click();
                          }}
                          className="absolute bottom-0 right-0 w-10 h-10 -mx-1 -my-1"
                          disabled={isLoading}
                        >
                          {isUploading ? (
                            <span className="text-xs">{progress + "%"}</span>
                          ) : (
                            <img
                              className="w-8 h-8 pl-1 pr-2"
                              src={process.env.PUBLIC_URL + "/edit.svg"}
                              alt="Icon"
                            />
                          )}
                        </RoundedButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-16 md:ml-12 w-full">
            <div className="flex">
              <h2 className="font-bold text-2xl">Informasi Personal</h2>
              {isLoading ? (
                ""
              ) : (
                <TransparentButton
                  label="Edit"
                  onClick={() => {
                    setShowProfileModal(true);
                  }}
                  className="text-yellow-500 bg-yellow-100 border-yellow-500"
                />
              )}
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-3 my-1">
                <h2 className="font-semibold text-xl">Nama Lengkap</h2>
                {isLoading ? (
                  <Skeleton className="w-full h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 my-1">
                <h2 className="font-semibold text-xl">Tanggal Lahir</h2>
                {isLoading ? (
                  <Skeleton className="w-5/6 h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.birthday ? moment(data.birthday).format("ll") : ""}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 my-1">
                <h2 className="font-semibold text-xl">Jenis Kelamin</h2>
                {isLoading ? (
                  <Skeleton className="w-3/5 h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.sex === 0 ? "Perempuan" : "Laki - Laki"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-16 md:ml-12 w-full">
            <div className="flex">
              <h2 className="font-bold text-2xl">Informasi Kontak</h2>
              {isLoading ? (
                ""
              ) : (
                <TransparentButton
                  label="Edit"
                  onClick={() => {
                    setShowContactModal(true);
                  }}
                  className="text-yellow-500 bg-yellow-100 border-yellow-500"
                />
              )}
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">Email</h2>
                {isLoading ? (
                  <Skeleton className="w-4/5 h-6 rounded" count={1} />
                ) : (
                  <div className="flex">
                    <span className="font-normal text-xl col-span-2">
                      {data.email}
                    </span>
                    {isLoading
                      ? ""
                      : !data.email_verified_at && (
                          <TransparentButton
                            label={isTextLoading ? "Loading..." : "Verifikasi"}
                            onClick={() => {
                              handleVerifikasi();
                            }}
                            className="text-yellow-500 bg-yellow-100 border-yellow-500"
                          />
                        )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">No. Telepon</h2>
                {isLoading ? (
                  <Skeleton className="w-1/2 h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Biodata;

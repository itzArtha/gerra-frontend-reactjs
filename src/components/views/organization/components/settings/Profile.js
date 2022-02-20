import RoundedButton from "../../../../RoundedButton";
import ErrorLabel from "../../../../ErrorLabel";
import Skeleton from "../../../../Skeleton";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MainModal from "../../../../modals/MainModal";
import TransparentButton from "../../../../TransparentButton";
import MainInput from "../../../../MainInput";
import Label from "../../../../Label";
import MainButton from "../../../../MainButton";
import MainTextArea from "../../../../MainTextArea";
import apiClient from "../../../../services/apiClient";
import QRCode from "qrcode.react";
import Swal from "sweetalert2";

const Profile = () => {
  const [isTextLoading, setTextLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQRcodeModal, setQRcodeModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputProfilFoto = useRef(null);
  const inputProfilBanner = useRef(null);
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
    tagline: "",
    isTaglineError: false,
    taglineErrorLabel: "",
    isTaglineOverChar: false,
    domain: "",
    isDomainError: false,
    isDomainOverChar: false,
    domainErrorLabel: "",
    description: "",
    isDescriptionError: false,
    isDescriptionOverChar: false,
    descriptionErrorLabel: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("api/v1/organization")
        .then((response) => {
          setData(response.data.data);
          setformData({
            name: response.data.data.name,
            tagline: response.data.data.tagline
              ? response.data.data.tagline
              : "",
            domain: response.data.data.slug,
            description: response.data.data.description
              ? response.data.data.description
              : "",
            email: response.data.data.email,
            phone: response.data.data.phone,
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
    if (formData.name && formData.domain) {
      setformData({
        ...formData,
        isNameError: false,
        isDomainError: false,
      });
      updateProfileHandler();
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Nama ga boleh kosong dibilangin!",
      });
    } else if (!formData.domain) {
      setformData({
        ...formData,
        isDomainError: true,
        domainErrorLabel: "Domain kosong nanti mau akses apa?",
      });
    }
  };

  const updateContactHandler = async () => {
    await apiClient
      .put("api/v1/organization/contact", {
        email: formData.email,
        phone: formData.phone,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setShowContactModal(false);
      })
      .catch((error) => {
        console.log(error.response.data);
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
    await apiClient
      .put("api/v1/organization/profile", {
        name: formData.name,
        username: formData.domain,
        tagline: formData.tagline,
        description: formData.description,
      })
      .then((response) => {
        handleSwal(response.data.message);
        setShowProfileModal(false);
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
      .post(
        `api/v1/organization/${
          name === "photo_url" ? "profile-photos" : "banner-photos"
        }`,
        dataUpload,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            setProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUploading(false);
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

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-download");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QrCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <MainModal
        title="QR Code"
        showModal={showQRcodeModal}
        handleClose={() => {
          setQRcodeModal(false);
        }}
        buttons={false}
      >
        <div className="flex justify-center">
          <QRCode
            id="qr-download"
            size="80"
            renderAs="canvas"
            value={`https://exotix.id/${data.slug}`}
          />
        </div>
        <div className="text-center m-4">
          <MainButton onClick={downloadQRCode} label="Download" />
        </div>
      </MainModal>
      <MainModal
        showModal={showProfileModal || showContactModal}
        handleClose={() => {
          showProfileModal
            ? setShowProfileModal(false)
            : setShowContactModal(false);
        }}
        buttonLabel={"Simpan"}
        title={
          showProfileModal
            ? "Ubah Informasi Organisasi"
            : "Ubah Informasi Kontak"
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
                <Label label="Nama Organisasi" />
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
                <Label label="Tagline" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <MainInput
                  value={formData.tagline}
                  onChange={(e) => {
                    if (e.target.value.length > 88) {
                      setformData({
                        ...formData,
                        isTaglineOverChar: true,
                        isTaglineError: true,
                        taglineErrorLabel: "Gak boleh lebih dari 18 karakter",
                      });
                    } else {
                      setformData({
                        ...formData,
                        tagline: e.target.value,
                        isTaglineOverChar: false,
                        isTaglineError: false,
                      });
                    }
                  }}
                  name="tagline"
                  type="text"
                />
              )}
              {isLoading ? (
                ""
              ) : (
                <div className="flex justify-between">
                  <ErrorLabel
                    label={
                      formData.isTaglineError ? formData.taglineErrorLabel : ""
                    }
                  />

                  <span
                    className={`text-sm flex ${
                      formData.isTaglineOverChar ? "text-red-600" : ""
                    }`}
                  >
                    {formData.tagline.length}/88
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-16 h-2 rounded" count={1} />
              ) : (
                <Label label="Domain" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <div className="flex">
                  <MainButton
                    type="button"
                    className="mr-2"
                    disabled={isLoading}
                    label="exotix.id/"
                  />
                  <MainInput
                    value={formData.domain}
                    onChange={(e) => {
                      if (e.target.value.length > 18) {
                        setformData({
                          ...formData,
                          isDomainError: true,
                          isDomainOverChar: true,
                          domainErrorLabel: "Dibilangin 18 karakter doang!",
                        });
                      } else {
                        setformData({
                          ...formData,
                          domain: e.target.value,
                          isDomainError: false,
                          isDomainOverChar: false,
                        });
                      }
                    }}
                    name="domain"
                    type="text"
                  />
                </div>
              )}
              {isLoading ? (
                ""
              ) : (
                <div className="flex justify-between">
                  <ErrorLabel
                    label={
                      formData.isDomainError ? formData.domainErrorLabel : ""
                    }
                  />

                  <span
                    className={`text-sm flex ${
                      formData.isDomainOverChar ? "text-red-600" : ""
                    }`}
                  >
                    {formData.domain.length}/18
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-16 h-2 rounded" count={1} />
              ) : (
                <Label label="Deskripsi" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-20 rounded" count={1} />
              ) : (
                <MainTextArea
                  type="text"
                  max="819"
                  name="description"
                  onChange={(e) => {
                    if (e.target.value.length > 818) {
                      setformData({
                        ...formData,
                        isDescriptionError: true,
                        isDescriptionOverChar: true,
                        descriptionErrorLabel:
                          "Deskripsi tidak boleh lebih dari 818 karakter",
                      });
                    } else {
                      setformData({
                        ...formData,
                        description: e.target.value,
                        isDescriptionError: false,
                        isDescriptionOverChar: false,
                      });
                    }
                  }}
                  value={formData.description}
                />
              )}
              {isLoading ? (
                ""
              ) : (
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
                    {formData.description.length}/818
                  </span>
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
                    formData.bannerUrl
                      ? formData.bannerUrl
                      : data.banner_url
                      ? data.banner_url
                      : `https://cdn.tuk.dev/assets/webapp/forms/form_layouts/form1.jpg`
                  }
                  alt="Banner"
                  className="w-full h-full object-cover rounded absolute shadow"
                />
              )}
              <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded"></div>
              <input
                type="file"
                name="banner_url"
                className="hidden"
                ref={inputProfilBanner}
                onChange={handlePreview}
              />
              {isLoading ? (
                ""
              ) : (
                <div
                  className="flex items-center px-3 py-2 rounded absolute right-0 mr-4 mt-4 cursor-pointer"
                  disabled={isLoading}
                  onClick={(e) => {
                    inputProfilBanner.current &&
                      inputProfilBanner.current.click();
                  }}
                >
                  <p className="text-xs text-gray-100">
                    {isUploading
                      ? "Mengupload... " + progress
                      : "Change Cover Photo"}
                  </p>
                  {!isUploading && (
                    <div className="ml-2 text-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-edit"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                        <line x1="16" y1="5" x2="19" y2="8" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
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
                          : `https://ui-avatars.com/api/?bold=true&name=${data.name}&background=random&?size=128&length=1`
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
              <h2 className="font-bold text-2xl">Informasi Organisasi</h2>
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
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">Nama Organisasi</h2>
                {isLoading ? (
                  <Skeleton className="w-full h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">Tagline</h2>
                {isLoading ? (
                  <Skeleton className="w-5/6 h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.tagline}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">Link</h2>
                {isLoading ? (
                  <Skeleton className="w-1/2 h-6 rounded" count={1} />
                ) : (
                  <div className="flex">
                    <Link
                      to={`/${data.slug}`}
                      className="font-normal text-xl col-span-2 underline text-blue-500 cursor-pointer"
                    >
                      {`exotix.id/${data.slug}`}
                    </Link>
                    <TransparentButton
                      label="QR"
                      onClick={() => {
                        setQRcodeModal(true);
                      }}
                      className="text-green-500 bg-green-100 border-green-500"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3">
                <h2 className="font-semibold text-xl">Deskripsi</h2>
                {isLoading ? (
                  <Skeleton className="w-3/5 h-6 rounded" count={1} />
                ) : (
                  <span className="font-normal text-xl col-span-2">
                    {data.description}
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
export default Profile;

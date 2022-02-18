import MainLayout from "../../layouts/MainLayout";
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../MainInput";
import Label from "../../Label";
import ErrorLabel from "../../ErrorLabel";
import AlertLabel from "../../AlertLabel";
import MainBtn from "../../MainButton";
import SecBtn from "../../SecondaryButton";
import RoundedButton from "../../RoundedButton";
import MainTextArea from "../../MainTextArea";
import apiClient from "../../services/apiClient";
import AlertModal from "../../modals/AlertModal";
import Skeleton from "../../Skeleton";

const CompleteProfile = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isSubmiting, setSubmiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const inputFile = useRef(null);
  const [formData, setformData] = useState({
    file: null,
    fileUrl: "",
    fileName: "",
    isFileError: false,
    fileErrorLabel: "",
    name: "",
    isNameError: false,
    nameErrorLabel: "",
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
      setLoading(true);
      await apiClient
        .get("api/v1/organization")
        .then((response) => {
          setLoading(false);
          setformData({
            fileUrl: response.data.data.photo_url,
            name: response.data.data.name,
            domain: response.data.data.slug,
            description: response.data.data.description
              ? response.data.data.description
              : "",
            tagline: response.data.data.tagline
              ? response.data.data.tagline
              : "",
          });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            history.push("/login");
          } else {
            setShowModal(true);
          }
        });
    };
    fetchData();
  }, []);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (
      file.size <= 5000000 &&
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    ) {
      const data = new FormData();
      data.append("photo_url", file);
      setformData({
        ...formData,
        isFileError: false,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
      });
      handleUploadFile(data);
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setformData({
        ...formData,
        isFileError: true,
        fileErrorLabel: "Cuma boleh jpeg, jpg, atau png aja dibilangin!",
      });
    } else {
      setformData({
        ...formData,
        isFileError: true,
        fileErrorLabel: "File sizenya kegedean anj. Maks 5MB",
      });
    }
  };
  const handleUploadFile = async (dataUpload) => {
    setUploading(true);
    await apiClient
      .post("api/v1/organization/profile-photos", dataUpload, {
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
          // console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        setShowModal(true);
        setformData({
          ...formData,
          fileUrl: "",
          file: "",
        });
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.domain) {
      setSubmiting(true);
      await apiClient
        .put("/api/v1/organization/profile", {
          username: formData.domain,
          name: formData.name,
          tagline: formData.tagline,
          description: formData.description,
        })
        .then((response) => {
          if (response.status === 200) {
            setSubmiting(false);
            history.push("/admin/dashboard");
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            setformData({
              ...formData,
              isDomainError: true,
              domainErrorLabel: "Domain telah digunakan",
            });
            setSubmiting(false);
          }
        });
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Nama organisasi tidak boleh kosong",
      });
    } else if (!formData.domain) {
      setformData({
        ...formData,
        isDomainError: true,
        domainErrorLabel: "Domain tidak boleh kosong",
      });
    }
  };
  return (
    <MainLayout>
      <AlertModal
        showModal={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        text={"Error gais, bentaran yak aksesnya. Mwahh :*"}
        button={true}
        image={process.env.PUBLIC_URL + "/broken-heart.svg"}
      />
      <div className="flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-4xl mt-12 lg:mt-10">
        <div className="hidden bg-cover lg:block lg:w-1/2 p-8">
          <img src={process.env.PUBLIC_URL + "/surprise.svg"} alt="Icon" />
          <div className="text-center mt-4">
            <span className="text-medium text-xl">
              Yuk join bersama kita disini
            </span>
            <img
              className="m-auto mt-4"
              width="120"
              height="120"
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Icon"
            />
          </div>
        </div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="block relative">
                {isLoading ? (
                  <Skeleton className="w-32 h-32 rounded-full" count={1} />
                ) : (
                  <img
                    alt="profil"
                    src={
                      formData.fileUrl
                        ? formData.fileUrl
                        : `https://ui-avatars.com/api/?bold=true&name=${formData.name}&background=random&?size=128&length=1`
                    }
                    className="mx-auto object-cover rounded-full w-32 h-32"
                  />
                )}
              </div>
              <input
                type="file"
                name="photo_url"
                className="hidden"
                ref={inputFile}
                onChange={handlePreview}
              />
              {isLoading ? (
                <div></div>
              ) : (
                <RoundedButton
                  type="button"
                  onClick={(e) => {
                    inputFile.current && inputFile.current.click();
                  }}
                  className="absolute bottom-0 right-0 w-10 h-10 -mx-1 -my-1"
                  disabled={isLoading}
                >
                  <img
                    className="px-1 w-6 h-6"
                    src={process.env.PUBLIC_URL + "/edit.svg"}
                    alt="Icon"
                  />
                </RoundedButton>
              )}
            </div>
            {formData.isFileError ? (
              <ErrorLabel label={formData.fileErrorLabel} />
            ) : isLoading ? (
              <Skeleton className="m-auto w-36 h-2 rounded" count={1} />
            ) : (
              <AlertLabel
                className="text-black"
                label={
                  isUploading
                    ? `Mengupload... ${progress}`
                    : `Maks. 5MB (PNG, JPEG & JPG)`
                }
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="w-28 h-2 rounded" count={1} />
              ) : (
                <Label label="Nama Organisasi" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <Input
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
                <Input
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
                  <MainBtn
                    type="button"
                    className="mr-2"
                    disabled={isLoading}
                    label="exotix.id/"
                  />
                  <Input
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

            <div className="mt-8 grid grid-cols-3 gap-2">
              {isLoading ? (
                <div className="col-span-1">
                  <Skeleton className="w-full h-12 rounded" count={1} />
                </div>
              ) : (
                <SecBtn
                  type="button"
                  label="Skip"
                  className="w-full col-span-1"
                  disabled={isUploading || isSubmiting}
                  onClick={() => {
                    history.push("/admin/dashboard");
                  }}
                />
              )}
              {isLoading ? (
                <div className="col-span-2">
                  <Skeleton className="w-full h-12 rounded" count={1} />
                </div>
              ) : (
                <MainBtn
                  type="submit"
                  className="w-full col-span-2"
                  disabled={isUploading || isSubmiting}
                  label={
                    isUploading || isSubmiting
                      ? "Loading.."
                      : "Simpan & Lanjutkan"
                  }
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
export default CompleteProfile;

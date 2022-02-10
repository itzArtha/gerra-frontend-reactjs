import QRCode from "qrcode.react";
import Checkbox from "../../../Checkbox";
import Label from "../../../Label";
import MainButton from "../../../MainButton";
import handleSwal from "../../../handleSwal";
import { useState } from "react";
import apiClient from "../../../services/apiClient";

const DetailPresensi = ({ data, eventSlug }) => {
  const [sertif, setSertif] = useState(data.is_share_certificate);
  const [btnLoading, setBtnLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileRes, setFilesRes] = useState(data.certificates);
  const [presence, setPresence] = useState({
    id: data.id,
    slug: data.slug,
    certificates: data.certificates,
    is_share_certificate: data.is_share_certificate,
    is_need_signature: data.is_need_signature,
    path_for_users: data.path_for_users,
  });

  const fetchPresence = () => {
    apiClient
      .get("/api/v1/presence/" + eventSlug + "/edit")
      .then((response) => {
        setPresence({
          id: response.data.data.id,
          slug: response.data.data.slug,
          certificates: response.data.data.certificates,
          is_share_certificate: response.data.data.is_share_certificate,
          is_need_signature: response.data.data.is_need_signature,
          path_for_users: response.data.data.path_for_users,
        });
        setSertif(response.data.data.is_share_certificate);
        setFilesRes(response.data.data.certificates);
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
    downloadLink.download = `QrCode-Presensi.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const testOverlay = () => {
    setBtnLoading(true);
    apiClient.post("/api/v1/user/overlay/test/presence").then((response) => {
      handleSwal(response.data.message);
      setBtnLoading(false);
    });
  };

  const uploadCertFile = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size;
    const fileType = file.type;
    const fileId = document.getElementById("fileForm");

    if (fileSize <= 5000000 && ["application/pdf"].includes(fileType)) {
      const formdata = new FormData();
      formdata.append("certificates", file);
      uploadCertificate(formdata, file);
    } else if (!["application/pdf"].includes(fileType)) {
      handleSwal("Cuma boleh PDF aja ya kakak", "error");
    } else {
      handleSwal("File size 5MB maksimal pokoknya!", "error");
    }
    fileId.value = "";
  };

  const deleteCertFile = () => {
    apiClient
      .put("/api/v1/presence/" + presence.id, {
        certificates: null,
        is_share_certificate: false,
      })
      .then((response) => {
        fetchPresence();
      });
  };

  const editPresenceSignature = (status) => {
    apiClient.put("/api/v1/presence/" + presence.id, {
      is_need_signature: status,
    });
  };

  const uploadCertificate = (dataUpload, file) => {
    setUploading(true);
    apiClient
      .post("/api/v1/presence/" + presence.id + "/upload", dataUpload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((response) => {
        setFilesRes(URL.createObjectURL(file));
        fetchPresence();
        setUploading(false);
        handleSwal("Berhasil upload sertifikat");
      })
      .catch((error) => {
        setUploading(false);
      });
  };

  const editPresenceCertificate = (status) => {
    console.log(presence.is_need_signature);
    apiClient.put("/api/v1/presence/" + presence.id, {
      is_share_certificate: status,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="Detail Informasi">
          <div className="my-2">
            <Label label="Perlu tanda tangan peserta?" />
            <Checkbox
              checked={presence.is_need_signature}
              onChange={(e) => {
                setPresence({
                  ...presence,
                  is_need_signature: e.target.checked,
                });
                editPresenceSignature(e.target.checked);
              }}
              label="Perlu"
            />
          </div>
          <div className="my-2">
            <Label label="Setiap peserta dapat sertifikat setelah presensi?" />
            <Checkbox
              checked={presence.is_share_certificate}
              onChange={(e) => {
                setSertif(e.target.checked);
                setPresence({
                  ...presence,
                  is_share_certificate: e.target.checked,
                });
                editPresenceCertificate(e.target.checked);
              }}
              label="Dapat"
            />
          </div>
          <div>
            {sertif && !uploading && !fileRes ? (
              <div>
                <div className="flex justify-start">
                  <div className="mb-3 w-96">
                    <input
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      type="file"
                      onChange={uploadCertFile}
                      id="fileForm"
                    />
                  </div>
                </div>
              </div>
            ) : sertif && uploading ? (
              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-4">
                <div
                  className="bg-green-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {" "}
                  {progress}%
                </div>
              </div>
            ) : (
              ""
            )}
            {sertif && !uploading && fileRes ? (
              <div className="flex gap-2">
                <div>
                  <a
                    className="text-blue-500"
                    href={presence.certificates}
                    target={"__blank"}
                  >
                    {"Lihat Sertifikat"}
                  </a>
                </div>
                <div
                  className="w-6 h-6 cursor-pointer"
                  onClick={deleteCertFile}
                >
                  <img
                    className="h-6 w-6"
                    src={process.env.PUBLIC_URL + "/trash-red.svg"}
                    alt="Icon"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <QRCode
            value={presence.path_for_users}
            id="qr-download"
            size={256}
            renderAs="canvas"
          />
        </div>
      </div>
      <div
        title="Buttons"
        className="grid grid-cols-2 md:grid-cols-4 gap-2 my-8"
      >
        <MainButton
          className="w-full"
          onClick={() => {
            window.open(`/overlay/${eventSlug}`, "_blank");
          }}
          label="Buka Overlay"
        />
        <MainButton
          className="w-full"
          onClick={testOverlay}
          label={btnLoading ? `Loading...` : `Test Overlay`}
        />
        <MainButton
          className="w-full"
          onClick={() => {
            navigator.clipboard.writeText(presence.path_for_users);
            handleSwal("Berhasil menyalin link QR");
          }}
          label="Copy Link QR"
        />
        <MainButton
          className="w-full"
          onClick={() => {
            downloadQRCode();
          }}
          label="Download QR"
        />
      </div>
      <div title="Example Overlay">
        <h2 className="font-semibold text-lg">Example Overlay</h2>
        <div className="border p-4 my-2">
          <div className="flex justify-center">
            <img
              className="w-40 h-40 rounded-full object-cover"
              src="https://avatars.dicebear.com/api/bottts/yusa.svg"
              alt="Profile"
            />
          </div>
          <div className="flex justify-center my-4">
            <div className="border-2 border-black bg-yellow-400 rounded p-4 w-3/4">
              <h2 className="font-semibold text-4xl text-center leading-relaxed">
                Selamat pagi yusa, <br /> dan selamat datang di acara webinar
                gratis
                <br />
              </h2>
              <span className="font-light text-3xl flex justify-center leading-relaxed">
                Jangan lupa overthinking 😘
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPresensi;

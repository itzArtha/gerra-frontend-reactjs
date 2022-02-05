import QRCode from "qrcode.react";
import Checkbox from "../../../Checkbox";
import Label from "../../../Label";
import MainButton from "../../../MainButton";
import handleSwal from "../../../handleSwal";
import { useState } from "react";

const DetailPresensi = () => {
  const [sertif, setSertif] = useState(false);
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="Detail Informasi">
          <div className="my-2">
            <Label label="Perlu tanda tangan peserta?" />
            <Checkbox label="Perlu" />
          </div>
          <div className="my-2">
            <Label label="Setiap peserta dapat sertifikat setelah presensi?" />
            <Checkbox
              onChange={(e) => {
                setSertif(e.target.checked);
              }}
              label="Dapat"
            />
          </div>
          <div>{sertif ? "Input Sertif" : ""}</div>
        </div>
        <div className="flex justify-center">
          <QRCode
            value="http://facebook.github.io/react/"
            id="qr-download"
            size="256"
            renderAs="canvas"
          />
        </div>
      </div>
      <div
        title="Buttons"
        className="grid grid-cols-2 md:grid-cols-4 gap-2 my-8"
      >
        <MainButton className="w-full" label="Buka Overlay" />
        <MainButton className="w-full" label="Test Overlay" />
        <MainButton
          className="w-full"
          onClick={() => {
            navigator.clipboard.writeText("www.exova.id");
            handleSwal("Berhasil menyalin kode pembayaran");
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
              src="https://images.unsplash.com/photo-1640057692320-c88208a4c832?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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

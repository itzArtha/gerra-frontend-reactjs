import QRCode from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import handleSwal from "../../../handleSwal";
import Label from "../../../Label";
import MainButton from "../../../MainButton";
import MainInput from "../../../MainInput";
import MainTextArea from "../../../MainTextArea";
import MainModal from "../../../modals/MainModal";
import RoundedButton from "../../../RoundedButton";
import SelectInput from "../../../SelectInput";
import apiClient from "../../../services/apiClient";
import MainBox from "../components/MainBox";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import CurrencyFormat from "react-currency-format";

const Dashboard = ({ slug }) => {
  const [showModalCaption, setShowModalCaption] = useState(false);
  const [showModalAnnouncement, setShowModalAnnouncement] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [dataTicket, setTicket] = useState([]);
  const [dataSells, setSells] = useState([]);
  const inputFile = useRef(null);
  const [announcement, setAnnouncement] = useState({
    to: "0",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/organization/event/" + slug)
        .then((response) => {
          setData(response.data.data);
          setTicket(response.data.data.ticket);
          setSells(response.data.data.sells);
        })
        .catch((error) => {
          console.log(error.response);
        });
    };
    fetchData();
  }, [slug]);

  let trans = 0;
  dataSells.map((item) => (trans += parseInt(item)));

  Chart.register(...registerables);
  const eventPath = window.location.origin + "/explore/event/" + slug;
  const autoCaption = (
    <div>
      <div className="my-4">
        <span>!! {data.title} !!</span>
      </div>
      <div>
        <span>Yuk ramein acara ini yukss guyss</span>
      </div>
      <div className="my-2">
        <span>Waktu: {moment(data.start_at).format("lll")}</span>
      </div>
      <div>
        <span>Tempat: {data.location}</span>
      </div>
      <div className="my-4">
        <span>Yukk beli cuma di tokoevent.id</span>
      </div>
    </div>
  );

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file.type === "application/pdf" && file.size <= 5000000) {
      setFile(file);
    } else if (file.size > 5000000) {
      handleSwal("Size kedegan bang", "error");
      file.value = "";
    } else {
      handleSwal("Format ga sesuai abng, PDF doang dibilangin!", "error");
      file.value = "";
    }
  };

  const handleModal = () => {
    if (showModalCaption) {
      // navigator.clipboard.writeText(autoCaption);
      // handleSwal("Berhasil menyalin caption");
      setShowModalCaption(false);
    } else {
      addAnnouncement();
    }
  };

  const addAnnouncement = async () => {
    const data = new FormData();
    data.append("to", announcement.to);
    data.append("subject", announcement.subject);
    data.append("message", announcement.message);
    data.append("eventid", slug);
    data.append("attachments", file);
    await apiClient
      .post("/api/v1/organization/announcement/event", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        handleSwal("Berhasil mengirim pengumuman");
      });
    setFile("");
    setAnnouncement({ to: "0", subject: "", message: "" });
    setShowModalAnnouncement(false);
  };

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-download");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QrCode-Event-${data.title}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const datas = {
    labels: dataTicket.map((item) => item.title),
    datasets: [
      {
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        data: dataSells.map((item) => item),
      },
    ],
  };

  return (
    <>
      <MainModal
        title={showModalCaption ? `Generate Caption` : `Buat Pengumuman`}
        buttonLabel={showModalCaption ? `Ok` : `Kirim`}
        showModal={showModalCaption || showModalAnnouncement}
        onClick={() => {
          handleModal();
        }}
        handleClose={() => {
          showModalCaption
            ? setShowModalCaption(false)
            : setShowModalAnnouncement(false);
        }}
      >
        {showModalCaption ? (
          <div>
            <div className="my-2">{autoCaption}</div>
          </div>
        ) : (
          <div>
            <div className="my-2">
              <Label label="Kepada" />
              <SelectInput
                onChange={(e) => {
                  setAnnouncement({ ...announcement, to: e.target.value });
                }}
                value={announcement.to}
              >
                <option value="0">Semua Peserta</option>
                {/*<option value="1">Semua Pengurus</option>*/}
              </SelectInput>
            </div>
            <div className="my-2">
              <Label label="Subyek" />
              <MainInput
                onChange={(e) => {
                  setAnnouncement({ ...announcement, subject: e.target.value });
                }}
                value={announcement.subject}
                type="text"
              />
            </div>
            <div className="my-2">
              <Label label="Pesan" />
              <MainTextArea
                onChange={(e) => {
                  setAnnouncement({ ...announcement, message: e.target.value });
                }}
                value={announcement.message}
              />
              {/* File Upload */}
              <div className="flex justify-between border border-t-0 rounded-b-lg p-4">
                {file ? (
                  <a
                    href={URL.createObjectURL(file)}
                    target={`_blank`}
                    className="font-semibold text-sm text-blue-600 my-auto"
                  >
                    {file.name}
                  </a>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      inputFile.current && inputFile.current.click();
                    }}
                  >
                    <input
                      type="file"
                      name="files"
                      className="hidden"
                      ref={inputFile}
                      onChange={handlePreview}
                    />
                    <div className="font-bold text-blue-600 hover:text-blue-500 duration-200">
                      Tambahkan file
                    </div>
                    <div className="text-sm">
                      hanya menerima .pdf (Max: 5MB)
                    </div>
                  </div>
                )}
                {file ? (
                  <div>
                    <RoundedButton
                      className="w-12 h-12 cursor-pointer"
                      onClick={() => {
                        setFile(null);
                      }}
                    >
                      <img
                        className="h-8 w-8 p-1"
                        src={process.env.PUBLIC_URL + "/trash.svg"}
                        alt="Icon"
                      />
                    </RoundedButton>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* File upload */}
            </div>
          </div>
        )}
      </MainModal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{trans}</div>
          <div className="font-light text-lg text-right pt-2">Peserta</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">
            {
              <CurrencyFormat
                value={data.revenue ?? 0}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            }
          </div>
          <div className="font-light text-lg text-right pt-2">Penjualan</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{trans}</div>
          <div className="font-light text-lg text-right pt-2">Transaksi</div>
        </MainBox>
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{data.viewers ?? 0}</div>
          <div className="font-light text-lg text-right pt-2">Pengunjung</div>
        </MainBox>
      </div>
      <div className="mt-12">
        {/* <h2 className="text-center font-semibold text-2xl"></h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-8">
          <div className="flex justify-center">
            <div className="md:w-3/5 w-full mb-8">
              <Doughnut
                data={datas}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Data Transaksi Tiket",
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <QRCode
              value={eventPath}
              id="qr-download"
              size={256}
              renderAs="canvas"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-2 my-8">
          <div>
            <MainButton
              onClick={() => {
                setShowModalAnnouncement(true);
              }}
              className="w-full"
              label="Buat Pengumuman"
            />
          </div>
          <div>
            <MainButton
              onClick={() => {
                setShowModalCaption(true);
              }}
              className="w-full"
              label="Generate Caption"
            />
          </div>
          <div>
            <MainButton
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(eventPath);
                handleSwal("Berhasil menyalin link QR");
              }}
              label="Copy Link QR"
            />
          </div>
          <div>
            <MainButton
              onClick={() => {
                downloadQRCode();
              }}
              className="w-full"
              label="Download QR"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;

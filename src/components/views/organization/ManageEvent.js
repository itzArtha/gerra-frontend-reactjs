import { useParams } from "react-router-dom";
import MainInput from "../../MainInput";
import SelectInput from "../../SelectInput";
import Label from "../../Label";
import MainButton from "../../MainButton";
import Checkbox from "../../Checkbox";
import MainLayout from "../../layouts/MainLayout";
import RoundedButton from "../../RoundedButton";
import { useRef, useState } from "react";
import MainTextArea from "../../MainTextArea";
import MainModal from "../../modals/MainModal";

const ManageEvent = () => {
  const { slug } = useParams();
  const inputFile = useRef(null);

  const [choice, setChoice] = useState(0);
  const [isOnline, setOnline] = useState(false);
  const [isTicketGroup, setTicketGroup] = useState(0);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showFormatModal, setFormatShowModal] = useState(false);
  const [showDateModal, setDateShowModal] = useState(false);
  const [showLocationModal, setLocationShowModal] = useState(false);
  const [showTicketModal, setTicketShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isTitleError: false,
    titleErrorLabel: "",
    // Format
    format: "",
    isFormatError: false,
    formatErrorLabel: "",
    kategori: "",
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
    ticketName: "",
    isTicketNameError: false,
    ticketNameErrorLabel: "",
    ticketType: "",
    isTicketTypeError: false,
    ticketTypeErrorLabel: "",
    maxPerson: "",
    isMaxPersonError: false,
    maxPersonErrorLabel: "",
    priceTicket: "",
    isPriceTicketError: false,
    priceTicketErrorLabel: "",
    amountTicket: "",
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

  const validateAddParticipant = (data) => {
    //
  };

  const handleSubmit = () => {
    console.log("OK");
  };
  return (
    <MainLayout top={true} footer={true}>
      <MainModal
        onClick={handleSubmit}
        buttonLabel={"Simpan"}
        title={
          showAddParticipantModal
            ? "Tambahkan info peserta"
            : showFormatModal
            ? "Format event"
            : showDateModal
            ? "Kapan event ini sih?"
            : showLocationModal
            ? "Dimana lokasinya?"
            : "Buat tiket"
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
            : setTicketShowModal(false);
        }}
        showModal={
          showAddParticipantModal ||
          showFormatModal ||
          showDateModal ||
          showLocationModal ||
          showTicketModal
        }
      >
        {showAddParticipantModal ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="my-2 col-span-2">
              <Label label="Nama Kolom" />
              <MainInput type="text" name="column_name" />
            </div>
            <div className="my-2">
              <Label label="Tipe" />
              <SelectInput name="typeColumn">
                <option value="1">Text</option>
              </SelectInput>
            </div>
          </div>
        ) : showFormatModal ? (
          <div>
            <div className="my-2">
              <Label label="Format" />
              <MainInput type="text" name="format" />
            </div>
            <div className="my-2">
              <Label label="Kategori" />
              <MainInput type="text" name="kategori" />
            </div>
          </div>
        ) : showDateModal ? (
          <div>
            <div className="grid grid-cols-3 gap-2">
              <div className="my-2 col-span-2">
                <Label label="Tanggal Mulai" />
                <MainInput type="date" name="startDate" />
              </div>
              <div className="my-2 col-span-1">
                <Label label="Waktu Mulai" />
                <MainInput type="time" name="startTime" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="my-2 col-span-2">
                <Label label="Tanggal Selesai" />
                <MainInput type="date" name="endDate" />
              </div>
              <div className="my-2 col-span-1">
                <Label label="Waktu Selesai" />
                <MainInput type="time" name="endTime" />
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
                label="Event ini online"
              />
            </div>
            {isOnline ? (
              <div className="my-2">
                <Label label="Link Streaming" />
                <MainInput type="text" name="streamUrl" />
              </div>
            ) : (
              <div>
                <div className="my-2">
                  <Label label="Nama Tempat" />
                  <MainInput type="text" name="location" />
                </div>
                <div className="mt-4">
                  <div className="w-full h-64 bg-gray-200"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="my-2">
              <Label label="Nama Tiket" />
              <MainInput type="text" name="ticketName" />
            </div>
            <div
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
                  }}
                  type="text"
                  name="ticketType"
                >
                  <option value={0}>Per orang</option>
                  <option value={1}>Per tim</option>
                </SelectInput>
              </div>
              {isTicketGroup === "1" ? (
                <div className="my-2">
                  <Label label="Maksimal orang dalam tim" />
                  <MainInput type="text" name="maxPerson" />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div className="my-2">
                  <Label label="Harga Tiket" />
                  <MainInput type="text" name="priceTicket" />
                </div>
                <div className="my-2">
                  <Label label="Jumlah Tiket" />
                  <MainInput type="text" name="amountTicket" />
                </div>
              </div>
              <div>
                <Checkbox label="Tiket ini gratis" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                <div className="my-2">
                  <Label label="Mulai Dijual" />
                  <MainInput type="date" name="startSaleTicket" />
                </div>
                <div className="my-2">
                  <Label label="Berakhir Dijual" />
                  <MainInput type="date" name="endSaleTicket" />
                </div>
              </div>
              <div className="my-2">
                <Label label="Deskripsi" />
                <MainTextArea
                  className="resize-none"
                  type="text"
                  name="deskripsiTicket"
                />
              </div>
            </div>
          </div>
        )}
      </MainModal>
      <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
        <div className="my-12">
          <div className="mt-4 mx-4 md:mx-0">
            <div className="grid md:grid-cols-3 grid-cols-1 md:gap-4">
              <div className="w-full h-72 bg-gray-400 mx-auto xl:mx-0 rounded">
                <div className="flex justify-end p-4 cursor-pointer">
                  <p className="text-gray-100 text-sm">Change Poster</p>
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
                </div>
              </div>
              <div className="my-8 col-span-2">
                <h2 className="font-bold text-2xl">Info dasar event</h2>
                <div className="my-4">
                  <div className="grid md:grid-cols-5 grid-cols-1 md:gap-2">
                    <div className="col-span-4 my-2">
                      <Label label="Judul Event" />
                      <MainInput type="text" name="info" />
                    </div>
                    <div className="col-span-1 my-2">
                      <Label label="Format Event" />
                      <MainButton
                        className="w-full"
                        onClick={() => {
                          setFormatShowModal(true);
                        }}
                        label="Pilih format"
                      />
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <div className="grid md:grid-cols-5 grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Label label="Penyelenggara" />
                      <h2 className="font-semibold text-xl">Exova Indonesia</h2>
                    </div>
                    <div className="col-span-2 my-2">
                      <Label label="Tanggal & Waktu" />
                      <MainButton
                        onClick={() => {
                          setDateShowModal(true);
                        }}
                        label="Pilih tanggal & waktu"
                      />
                    </div>
                    <div className="col-span-1 my-2">
                      <Label label="Lokasi" />
                      <MainButton
                        onClick={() => {
                          setLocationShowModal(true);
                        }}
                        className="w-full"
                        label="Pilih lokasi"
                      />
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
                  <div className="w-full border rounded grid grid-cols-4 gap-2 p-3">
                    <div className="border-r pr-3 col-span-1">
                      <div>
                        <img
                          src={
                            process.env.PUBLIC_URL + "/gerra-14Artboard 1.png"
                          }
                          alt=""
                        />
                        <div className="text-center">
                          <span className="text-xs">Powered by gerra.co</span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-3 col-span-3">
                      <div className="pb-3 border-b flex justify-between">
                        <div>
                          <span className="text-lg font-semibold">
                            Tiket Pendaftaran
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <RoundedButton
                            className="w-8 h-8"
                            onClick={() => {
                              setTicketShowModal(true);
                            }}
                          >
                            <img
                              className="w-4 h-4"
                              src={process.env.PUBLIC_URL + "/edit.svg"}
                              alt="Icon"
                            />
                          </RoundedButton>
                          <RoundedButton className="w-8 h-8">
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
                          Lorem ipsum dolor sit amet consectetur consectetur
                          elit.
                        </span>
                      </div>
                      <div className="flex justify-between bottom-0 mt-4">
                        <div>
                          <span className="text-sm font-light text-blue-600">
                            Dijual pada 04 Sept 2021
                          </span>
                        </div>
                        <div>
                          <span className="text-lg font-semibold">Rp250K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Ticket End */}
                </div>
                <div className="flex justify-center my-8">
                  <MainButton
                    onClick={() => {
                      setTicketShowModal(true);
                    }}
                    label="Buat Tiket Pendaftaran"
                  />
                </div>
              </div>
            </div>
            <div className="mt-16">
              <h2 className="font-bold text-2xl">Info peserta</h2>
              <div className="my-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Checkbox label="Nama Lengkap" />
                    <Checkbox label="Email" />
                    <Checkbox label="No. Telepon" />
                  </div>
                  <div>
                    <Checkbox label="Jenis Kelamin" />
                    <Checkbox label="Tanggal Lahir" />
                  </div>
                </div>
                <div className="flex justify-center my-4">
                  <MainButton
                    onClick={() => {
                      setShowAddParticipantModal(true);
                    }}
                    label="Tambah info peserta"
                  />
                </div>
              </div>
            </div>
            <div className="mt-16">
              <h2 className="font-bold text-2xl">Detail event</h2>
              <div className="my-4">
                <div className="flex justify-center gap-2">
                  <MainButton
                    onClick={() => {
                      setChoice(0);
                    }}
                    label="Deskripsi"
                  />
                  <MainButton
                    onClick={() => {
                      setChoice(1);
                    }}
                    label="Syarat & Ketentuan"
                  />
                </div>
              </div>
              <div className="w-full border rounded-lg p-4">
                <div>
                  <h2 className="font-semibold text-center text-lg pb-4">
                    {choice === 0 ? "Deskripsi" : "Syarat & Ketentuan"}
                  </h2>
                </div>
                {choice === 0 ? (
                  <MainTextArea type="text" name="deskripsi" />
                ) : (
                  <MainTextArea type="text" name="terms" />
                )}
                <div className="pt-4">
                  <div className="flex justify-between">
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
                  </div>
                </div>
              </div>
            </div>
            <div className="my-16">
              <div className="flex justify-center gap-2">
                <MainButton label="Simpan sebagai draf" />
                <MainButton label="Simpan & publikasikan" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default ManageEvent;

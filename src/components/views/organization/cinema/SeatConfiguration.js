import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import Label from "../../../Label";
import InputNumber from "../../../InputNumber";
import MainButton from "../../../MainButton";
import MainModal from "../../../modals/MainModal";
import ErrorLabel from "../../../ErrorLabel";
import SecButton from "../../../SecondaryButton";
import apiClient from "../../../services/apiClient.js";
import Skeleton from "../../../Skeleton";
import Swal from "sweetalert2";
import MainInput from "../../../MainInput";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import { isArray } from 'lodash'

const SeatConfiguration = () => {
  const history = useHistory();
  const { ticket, studio } = useParams();
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [dataStudio, setDataStudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFree, setFree] = useState(false);
  const [formData, setFormData] = useState({
    x: 0,
    y: 0,
    title: "",
    is_free: false,
    price: '0',
    amountTicket: 0,
    start_at: '',
    end_at: ''
  });
  const [rows, setRows] = useState({});

  useEffect(() => {
    getStudioData();
  }, []);

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
      icon: status || "success",
      title: data,
    });
  };

  const handleSeatChange = (value, rowLabel) => {
    setRows((prevRows) => {
      const newSeats = Array.from({ length: value }, (_, i) => ({
        id: i + 1,
        number: `${rowLabel}${i + 1}`,
      }));
      return { ...prevRows, [rowLabel]: newSeats };
    });
  };

  const handleAddRow = () => {
    setRows((prevRows) => {
        const lastRowLabel = Object.keys(prevRows).length ? Object.keys(prevRows).slice(-1)[0] : null;
        const newRowLabel = lastRowLabel ? String.fromCharCode(lastRowLabel.charCodeAt(0) + 1) : 'A'
        return {
          ...prevRows,
          [newRowLabel]: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            number: `${newRowLabel}${i + 1}`,
          })),
        };
      })
  };

  const handleDeleteRow = (rowLabel) => {
    setRows((prevRows) => {
      const { [rowLabel]: _, ...rest } = prevRows;
      const updatedRows = {};
      Object.keys(rest).forEach((label, index) => {
        const newLabel = String.fromCharCode(65 + index); // 'A', 'B', 'C', etc.
        updatedRows[newLabel] = rest[label].map((seat, i) => ({
          ...seat,
          number: `${newLabel}${i + 1}`,
        }));
      });
      return updatedRows;
    });
  };

  const handleGenerateSeats = () => {
    const newRows = {};
    for (let i = 0; i < formData.y; i++) {
      const rowLabel = String.fromCharCode(65 + i); // 'A', 'B', 'C', etc.
      newRows[rowLabel] = Array.from({ length: formData.x }, (_, j) => ({
        id: j + 1,
        number: `${rowLabel}${j + 1}`,
      }));
    }
    setRows(newRows);
    setShowSettingModal(false);
  };

  const getTotalSeats = () => {
    return Object.values(rows).reduce((total, row) => total + row.length, 0);
  };

  const getStudioData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`api/v1/organization/studio/${studio}`);
      const studioData = response.data.data;
      setDataStudio(studioData);
      setRows(studioData.tickets[0].seat_layout || {}); // Handle possible undefined seat_layout
      setLoading(false);
      setFormData({
        ...formData,
        price: studioData.tickets[0].price,
        amountTicket: studioData.tickets[0].amount,
        start_at: studioData.tickets[0].start_at,
        end_at: studioData.tickets[0].end_at,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      handleSwal(
        error?.data?.message || "Gagal ambil data studio",
        "error"
      );
    }
  };

  const SimpanKursiLayout = async () => {
    const finalData = [];
    const amount = getTotalSeats();
    const formattedPrice = parseInt(formData.price.toString().replace(/\D/g, ""));
    
    if (dataStudio?.tickets) {
      for (let i = 0; i < dataStudio.tickets.length; i++) {
        let data = {
          ...dataStudio.tickets[i],
          ...formData,
          price: formattedPrice,
          amount: amount,
          seat_layout: rows,
          total_seats: amount,
        };
    
        finalData.push(data);
      }

      try {
        await apiClient.patch(
          `api/v1/organization/event/batch/ticket`,
          {tickets : finalData}
        );
        history.goBack();
      } catch (error) {
        handleSwal(
          error?.data?.message || "Gagal edit, sorry ya....",
          "error"
        );
        console.log("sss", error);
      }
    } else {
      handleSwal("Data tiket tidak ditemukan", "error");
    }
  };

  return (
    <MainLayout top={true} footer={true}>
      <div className='p-4'>
        <h2 className="text-2xl font-bold">
          Atur ticket {dataStudio?.name}
        </h2>
       {/*  <div className="my-2">
          <Label label="Nama Tiket" />
          <MainInput
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                isTicketNameError: false,
              });
            }}
          />
          {formData.isTicketNameError && <ErrorLabel label={formData.ticketNameErrorLabel} />}
        </div> */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            {/* Uncomment and fix the following code if needed */}
            <div className="my-2 col-span-2">
              <Label label="Harga Tiket" />
              <CurrencyFormat
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: e.target.value,
                    isPriceTicketError: false,
                  });
                }}
                name="price"
                disabled={formData.is_free}
                thousandSeparator={true}
                prefix={"Rp"}
                value={formData.price}
                customInput={MainInput}
              />
              {formData.isPriceTicketError && <ErrorLabel label={formData.priceTicketErrorLabel} />}
            </div>
            {/* <div className="my-2">
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
              {formData.isAmountTicketError && <ErrorLabel label={formData.amountTicketErrorLabel} />}
            </div> */}
          </div>
          {/* <div>
            <Checkbox
              label="Tiket ini gratis"
              onChange={(e) => {
                setFree((isFree) => !isFree);
                setFormData({
                  ...formData,
                  is_free: e.target.checked,
                  priceTicket: "0",
                });
              }}
              checked={formData.is_free}
            />
          </div> */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
            <div className="my-2">
              <Label label="Mulai Dijual" />
              <MainInput
                min={moment().format("YYYY-MM-DDTHH:MM")}
                type="datetime-local"
                name="start_at"
                value={formData.start_at}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    start_at: e.target.value,
                    isStartSaleTicketError: false,
                  });
                }}
              />
              {formData.isStartSaleTicketError && <ErrorLabel label={formData.startSaleTicketErrorLabel} />}
            </div>
            <div className="my-2">
              <Label label="Berakhir Dijual" />
              <MainInput
                min={moment().add(1, "days").format("YYYY-MM-DDTHH:MM")}
                type="datetime-local"
                name="end_at"
                value={formData.end_at}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    end_at: e.target.value,
                    isEndSaleTicketError: false,
                  });
                }}
              />
              {formData.isEndSaleTicketError && <ErrorLabel label={formData.endSaleTicketErrorLabel} />}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 font-sans p-4 bg-white rounded-lg shadow-lg">
        <div className="col-span-3 bg-gray-200 p-4">
          <div className="flex flex-col items-center relative mb-6">
            <div className="flex justify-evenly w-full mb-4">
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-white border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Tersedia
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-gray-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Dipesan
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-yellow-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Terpilih
                </span>
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col space-y-2 mb-5 mt-5 w-full lg:w-3/4 md:w-5/6 sm:w-full h-64 overflow-x-auto lg:h-96 md:h-80 sm:h-64">
              <Skeleton className="w-full h-12 rounded" count="5" />
              </div>
            ) : (
              <div className="flex flex-col space-y-2 mb-5 mt-5 w-full lg:w-3/4 md:w-5/6 sm:w-full h-64 overflow-x-auto lg:h-96 md:h-80 sm:h-64">
                {Object.values(rows).map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex md:justify-center space-x-2"
                    style={{ whiteSpace: 'nowrap' }} // Mencegah elemen baris agar tidak membungkus
                  >
                    {row.map((seat) => (
                      <div
                        key={seat.id}
                        id={seat.number}
                        className={`w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs bg-white border border-gray-400`}
                        style={{ minWidth: '2rem', minHeight: '2rem' }} // Menjaga ukuran saat overflow
                      >
                        <span>{seat.number}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-1.5 bg-blue-300 rounded-b-md border-t border-gray-400"></div>
          </div>
        </div>
        <div className="col-span-2 px-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Atur Kursi</h2>
            <MainButton label="Pengaturan" onClick={() => setShowSettingModal(true)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="col-span-5 my-2 min-h-0 max-h-96 overflow-auto">
              {Object.keys(rows).map((rowLabel) => (
                <div key={rowLabel}>
                  <Label label={`Jumlah Kursi ${rowLabel}`} />
                  <div className="mb-2 grid md:grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <InputNumber
                        name="seat"
                        value={rows[rowLabel]?.length || 0}
                        onChange={(e) => handleSeatChange(parseInt(e), rowLabel)}
                        min={1}
                      />
                    </div>
                    <div className="col-span-1">
                      <SecButton
                        label="X"
                        onClick={() => handleDeleteRow(rowLabel)}
                        disabled={Object.keys(rows).length === 1 && rowLabel === "A"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-5 md:col-span-4 my-2">
              <MainButton label="Tambah Baris" onClick={handleAddRow} className="w-full" />
            </div>
          </div>
          <div className="col-span-2 p-4 flex justify-between">
            <h2 className="text-2xl font-bold">Total Kursi : {getTotalSeats()}</h2>
            <MainButton label="Simpan" onClick={SimpanKursiLayout} />
          </div>
        </div>
      </div>

      <MainModal
        showModal={showSettingModal}
        handleClose={() => setShowSettingModal(false)}
        title={"Atur Kursi"}
        onClick={handleGenerateSeats}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="my-2 col-span-1">
            <Label label="Baris Y" />
            <InputNumber
              name="y"
              value={formData.y}
              onChange={(e) => setFormData({ ...formData, y: e })}
              min={1}
            />
            {formData.isColumnNameError && <ErrorLabel label={formData.columnNameErrorLabel} />}
          </div>
          <div className="my-2 col-span-1">
            <Label label="Baris X" />
            <InputNumber
              name="x"
              value={formData.x}
              onChange={(e) => setFormData({ ...formData, x: e })}
              min={1}
            />
            {formData.isTypeColumnError && <ErrorLabel label={formData.typeColumnErrorLabel} />}
          </div>
        </div>
      </MainModal>
    </MainLayout>
  );
};

export default SeatConfiguration;

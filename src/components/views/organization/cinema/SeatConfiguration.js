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

const SeatConfiguration = () => {
  const history = useHistory();
  const { ticket, studio } = useParams();
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [dataStudio, setDataStudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    x: 0,
    y: 0,
  });
  const [rows, setRows] = useState({
    A: Array.from({ length: 13 }, (_, i) => ({
      id: i + 1,
      number: `A${i + 1}`,
    })),
  });

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
      const lastRowLabel = Object.keys(prevRows).slice(-1)[0];
      const newRowLabel = String.fromCharCode(lastRowLabel.charCodeAt(0) + 1);
      return {
        ...prevRows,
        [newRowLabel]: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          number: `${newRowLabel}${i + 1}`,
          isReserved: false,
        })),
      };
    });
  };

  const handleDeleteRow = (rowLabel) => {
    setRows((prevRows) => {
      const newRows = { ...prevRows };
      delete newRows[rowLabel];

      const updatedRows = {};
      Object.keys(newRows)
        .sort()
        .forEach((label, index) => {
          const newLabel = String.fromCharCode(65 + index); // 'A', 'B', 'C', etc.
          updatedRows[newLabel] = newRows[label].map((seat, i) => ({
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
    setLoading(true)
    await apiClient
      .get(`api/v1/organization/studio/${studio}`)
      .then((response) => {
        setDataStudio(response.data.data);
        setRows(response.data.data.tickets[0].seat_layout);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        handleSwal(
          error?.data?.message
            ? error?.data?.message
            : "gagal ambil data studio",
          "error"
        );
      });
  };

  const SimpanKursiLayout = async () => {
    let data = {
      title: dataStudio.tickets[0].title,
      price: dataStudio.tickets[0].price,
      amount: dataStudio.tickets[0].amount,
      seat_layout: rows,
      time: dataStudio.tickets[0].time,
    };

    await apiClient
      .patch(
        `api/v1/organization/event/ticket/${dataStudio.tickets[0].id}`,
        data
      )
      .then((response) => {
        history.goBack();
      })
      .catch((error) => {
        handleSwal(
          error?.data?.message
            ? error?.data?.message
            : "gagal edit sorry ya....",
          "error"
        );
        console.log("sss", error);
      });
  };

  useEffect(() => {
    getStudioData();
  }, []);

  return (
    <MainLayout top={true} footer={true}>
      <div className="grid grid-cols-5 gap-4 font-sans p-4 bg-white rounded-lg shadow-lg">
        <div className="col-span-3 bg-gray-200 p-4">
          <div className="flex flex-col items-center relative mb-6">
            <div className="flex justify-evenly w-full mb-4">
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-white border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Available
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-gray-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Booked
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-yellow-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Selected
                </span>
              </div>
            </div>
            {loading ? (
              <Skeleton className="w-24 h-4 rounded" count="1" />
            ) : (
              <div className="flex flex-col space-y-2 mb-5 mt-5 w-full">
                {Object.values(rows).map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex justify-center space-x-2"
                  >
                    {row.map((seat) => (
                      <div
                        key={seat.id}
                        id={seat.number}
                        className={`w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs bg-white border border-gray-400`}
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
            <h2 className="text-2xl font-bold">
              Atur Kursi {dataStudio?.name}
            </h2>
            <MainButton
              label="Setting"
              onClick={() => setShowSettingModal(true)}
            ></MainButton>
          </div>
          <div className="grid md:grid-cols-5 grid-cols-1 md:gap-2">
            <div className="col-span-5 my-2 min-h-0 max-h-96 overflow-auto">
              {Object.keys(rows).map((rowLabel) => (
                <div key={rowLabel}>
                  <Label label={`Jumlah Kursi ${rowLabel}`} />
                  <div className="mb-2 grid md:grid-cols-3 md:gap-2">
                    <div className="col-span-2">
                      <InputNumber
                        name="seat"
                        value={rows[rowLabel].length}
                        onChange={(e) =>
                          handleSeatChange(parseInt(e), rowLabel)
                        }
                        min={1}
                      />
                    </div>
                    <div className="col-span-1">
                      <SecButton
                        label="X"
                        onClick={() => handleDeleteRow(rowLabel)}
                        disabled={
                          Object.keys(rows).length === 1 && rowLabel === "A"
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-4 my-2">
              <MainButton
                label="Tambah Baris"
                onClick={handleAddRow}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-span-2 p-4 flex justify-between">
            <h2 className="text-2xl font-bold">
              Total Kursi : {getTotalSeats()}
            </h2>
            <MainButton label="Simpan" onClick={() => SimpanKursiLayout()} />
          </div>
        </div>
      </div>

      <MainModal
        showModal={showSettingModal}
        handleClose={() => {
          setShowSettingModal(false);
        }}
        title={"Atur Kursi"}
        onClick={handleGenerateSeats}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="my-2 col-span-1">
            <Label label="Baris Y" />
            <InputNumber
              name="y"
              value={formData.y}
              onChange={(e) => {
                setFormData({ ...formData, y: e });
              }}
              min={1}
            />
            {formData.isColumnNameError ? (
              <ErrorLabel label={formData.columnNameErrorLabel} />
            ) : (
              ""
            )}
          </div>
          <div className="my-2 col-span-1">
            <Label label="Baris X" />
            <InputNumber
              name="x"
              value={formData.x}
              onChange={(e) => {
                setFormData({ ...formData, x: e });
              }}
              min={1}
            />
            {formData.isTypeColumnError ? (
              <ErrorLabel label={formData.typeColumnErrorLabel} />
            ) : (
              ""
            )}
          </div>
        </div>
      </MainModal>
    </MainLayout>
  );
};

export default SeatConfiguration;

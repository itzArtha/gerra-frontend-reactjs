import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import CurrencyFormat from "react-currency-format";
import apiClient from "../../../services/apiClient.js";
import MainButton from "../../../MainButton.js";
import handleSwal from "../../../handleSwal";

const Seat = () => {
  const history = useHistory()
  const { event, studio } = useParams();
  const [selected, setSelected] = useState([]);
  const [dataStudio, setDataStudio] = useState(null);
  const [price, setPrice] = useState(0);
  const [rows, setRows] = useState({
    A: Array.from({ length: 13 }, (_, i) => ({
      id: i + 1,
      number: `A${i + 1}`,
      isReserved: false,
    })),
  });

  const [calculate, setCalculate] = useState({
    subtotal: 0,
    fee: 0, // Biaya admin per tiket
    discount: 0,
    total: 0,
  });

  const addSeatCallback = (seat) => {
    setSelected((prevItems) => {
      const updatedSelected = [...prevItems, seat];
      updateTotalPrice(updatedSelected);
      return updatedSelected;
    });
  };

  const removeSeatCallback = (seat) => {
    setSelected((prevItems) => {
      const updatedSelected = prevItems.filter((item) => item !== seat);
      updateTotalPrice(updatedSelected);
      return updatedSelected;
    });
  };

  const updateTotalPrice = (selectedSeats) => {
    const subtotal = price * selectedSeats.length;
    const fee =   5000 * selectedSeats.length; // Biaya admin untuk semua tiket
    const total = subtotal + fee;
    setCalculate({
      subtotal,
      fee,
      total,
    });
  };

  const getSelectedSeats = () => {
    const selectedSeats = [];
    Object.values(rows).forEach((row) => {
      row.forEach((seat) => {
        if (selected.includes(seat.number)) {
          selectedSeats.push(seat.number);
        }
      });
    });
    return selectedSeats;
  };

  const getStudioData = async () => {
    try {
      const response = await apiClient.get(`api/v1/user/studio/${studio}`);
      setDataStudio(response.data.data);
      setRows(response.data.data.tickets[0].seat_layout);
      setPrice(response.data.data.tickets[0].price);
    } catch (error) {
      handleSwal("Gagal ambil data studio", "error");
    }
  };

    const handleCheckout = async () => {;
    await apiClient
      .post("/api/v1/user/checkout", {
        event_id: dataStudio.tickets[0].id,
        ticket:[
          {id : dataStudio.tickets[0].id}
        ],
        quantity: getSelectedSeats().length,
        seats: getSelectedSeats(),
      })
      .then((response) => {
        if (response.status === 200) {
          history.push("/payment");
        } else if (response.status === 201) {
          window.location = "/tickets/all-tickets";
        }
      })
      .catch((error) => {
      console.log(error)
      });
  };

  


  useEffect(() => {
    getStudioData();
  }, [studio]);

  return (
    <MainLayout top={true} footer={true} menu={true}>
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
            <div className="flex flex-col space-y-2 mb-5 mt-5 w-full">
              {rows && Object.values(rows).map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className="flex justify-center space-x-2"
                >
                  {row.map((seat) => (
                    <div
                      key={seat.id}
                      id={seat.number}
                      onClick={() => {
                        if (!seat.isReserved) {
                          if (selected.includes(seat.number)) {
                            removeSeatCallback(seat.number);
                          } else {
                            addSeatCallback(seat.number);
                          }
                        }
                      }}
                      className={`w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs ${
                        seat.isReserved
                          ? "bg-gray-400 cursor-not-allowed"
                          : selected.includes(seat.number)
                          ? "bg-yellow-400"
                          : "bg-white border border-gray-400"
                      }`}
                    >
                      <span>{seat.number}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-1.5 bg-blue-300 rounded-b-md border-t border-gray-400"></div>
          </div>
        </div>
        <div className="col-span-2 p-4">
          <h2 className="text-2xl font-bold">Informasi Pembelian</h2>
          <div className="mt-4">
            <div className="mt-2">
              <div className="flex justify-between my-1">
                <div>
                  <span className="text-xl">Tiket ({selected.length})</span>
                </div>
                <div>
                  <span className="font-semibold text-xl">
                    <CurrencyFormat
                      value={calculate.subtotal}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </span>
                </div>
              </div>
              <div className="flex justify-between my-1">
                <div>
                  <span className="text-xl">Biaya Admin ({selected.length})</span>
                </div>
                <div>
                  <span className="font-semibold text-xl">
                    <CurrencyFormat
                      value={calculate.fee}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </span>
                </div>
              </div>
              <div className="mt-20">
                <h2 className="text-xl font-bold text-right">Subtotal</h2>
                <h2
                  className={`text-4xl font-bold text-right ${
                    calculate.total ? "animate-pulse" : ""
                  }`}
                >
                  <CurrencyFormat
                    value={calculate.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </h2>
              </div>
            </div>
          </div>
          <MainButton
            label="Checkout"
            onClick={() => {
              const seats = handleCheckout();
              if (seats.length > 0) {
                // Implement your checkout logic here
                console.log('Selected seats:', seats);
              } else {
                handleSwal("Pilih tiket terlebih dahulu", "warning");
              }
            }}
            className="w-full mt-5"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Seat;
